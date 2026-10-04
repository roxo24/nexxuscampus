import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { Button, Avatar } from '../components/ui';
import { talent } from '../data/mock';
import { getMensajesProyecto, enviarMensajeChat, activarWhatsApp } from '../services/api';

interface MensajeItem {
  own: boolean;
  name: string;
  text: string;
  time: string;
  system?: boolean;
}

export function Messages({ onLeave, initialProject }: { onLeave: () => void; initialProject: string }) {
  const [activeRoom, setActiveRoom] = useState(initialProject);
  const [message, setMessage] = useState('');
  const [enlaceWhatsapp, setEnlaceWhatsapp] = useState<string | null>(null);
  const [loadingWa, setLoadingWa] = useState(false);
  
  const [messages, setMessages] = useState<MensajeItem[]>([
    { own: false, name: 'NexusCampus', text: `¡Conexión confirmada! Ya puedes conversar con ${initialProject} y comenzar a coordinar.`, time: 'Ahora', system: true },
    { own: false, name: initialProject, text: '¡Hola! Me alegra que hayamos conectado. Cuéntame más sobre lo que te gustaría construir.', time: 'Ahora' }
  ]);

  // Cargar mensajes y estado de WhatsApp desde el backend
  useEffect(() => {
    setActiveRoom(initialProject);
    async function cargarChat() {
      try {
        const data = await getMensajesProyecto(1); // Proyecto 1 por defecto en demo
        if (data) {
          if (data.enlace_whatsapp) {
            setEnlaceWhatsapp(data.enlace_whatsapp);
          }
          if (data.mensajes && data.mensajes.length > 0) {
            const formateados: MensajeItem[] = data.mensajes.map((m: any) => ({
              own: m.remitente_id === 1,
              name: m.es_mensaje_sistema ? 'NexusCampus' : (m.remitente_nombre || 'Integrante'),
              text: m.contenido,
              time: m.fecha_envio ? m.fecha_envio.slice(11, 16) : 'Ahora',
              system: Boolean(m.es_mensaje_sistema)
            }));
            setMessages(formateados);
          }
        }
      } catch (err) {
        console.log('Modo local de mensajería activo');
      }
    }
    cargarChat();
  }, [initialProject]);

  const send = async () => {
    if (!message.trim()) return;
    const nuevoTexto = message.trim();
    const tempMensaje: MensajeItem = { own: true, name: 'Tú', text: nuevoTexto, time: 'Ahora' };
    setMessages(prev => [...prev, tempMensaje]);
    setMessage('');

    try {
      await enviarMensajeChat(1, 1, nuevoTexto);
    } catch (e) {
      console.warn('Mensaje registrado localmente');
    }
  };

  const handleActivarWhatsApp = async () => {
    if (enlaceWhatsapp) {
      window.open(enlaceWhatsapp, '_blank');
      return;
    }

    try {
      setLoadingWa(true);
      const res = await activarWhatsApp(1);
      const link = res.enlace_whatsapp || `https://chat.whatsapp.com/NexusUNP_P1`;
      setEnlaceWhatsapp(link);
      setMessages(prev => [
        ...prev,
        {
          own: false,
          name: 'NexusCampus',
          text: `📲 ¡Se ha creado el grupo oficial de WhatsApp! Únanse aquí: ${link}`,
          time: 'Ahora',
          system: true
        }
      ]);
      window.open(link, '_blank');
    } catch (err) {
      const fallbackLink = `https://chat.whatsapp.com/NexusUNP_Demo`;
      setEnlaceWhatsapp(fallbackLink);
      window.open(fallbackLink, '_blank');
    } finally {
      setLoadingWa(false);
    }
  };

  const baseRooms = [
    ['Vitrina Circular','Diego: Revisé el brief…','10:28','2'],
    ['Aula Nómada','Nuevo equipo conectado','Ahora','1'],
    ['Comunidad Nexus','Nuevo evento este viernes','Lun','']
  ];
  const rooms = baseRooms.some(room => room[0] === initialProject) ? baseRooms : [[initialProject,'Conexión nueva · Chat disponible','Ahora','1'],...baseRooms];
  const directPerson = talent.find(person => person.name === activeRoom);

  return <div className="chat-layout chat-polished">
    <aside className="rooms">
      <div className="rooms-head">
        <h2>Mensajes</h2>
        <button><Icon name="plus"/></button>
      </div>
      <div className="room-search">
        <Icon name="search" size={16}/>
        <input placeholder="Buscar conversación"/>
      </div>
      {rooms.map(r => (
        <button 
          className={`room ${activeRoom === r[0] ? 'active' : ''}`} 
          onClick={() => setActiveRoom(r[0])} 
          key={r[0]}
        >
          <div className="project-logo">{r[0].split(' ').map(x=>x[0]).join('').slice(0,2)}</div>
          <span>
            <b>{r[0]}</b>
            <small>{r[1]}</small>
          </span>
          <em>{r[2]}{r[3] && <i>{r[3]}</i>}</em>
        </button>
      ))}
    </aside>

    <section className="conversation">
      <header>
        <div>
          <div className="project-logo">{activeRoom.split(' ').map(x=>x[0]).join('').slice(0,2)}</div>
          <span>
            <h2>{activeRoom}</h2>
            <p><i/> {directPerson ? 'Conexión confirmada · Chat directo' : 'Chat oficial del equipo · NexusCampus'}</p>
          </span>
        </div>

        <div className="chat-members" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Botón WhatsApp oficial integrado (CU-06) */}
          <button 
            onClick={handleActivarWhatsApp}
            disabled={loadingWa}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 0,
              padding: '7px 13px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(16,185,129,.25)'
            }}
          >
            <span>📲</span>
            <span>{loadingWa ? 'Generando…' : enlaceWhatsapp ? 'Abrir WhatsApp del Equipo' : 'Crear Grupo de WhatsApp'}</span>
          </button>

          {directPerson ? (
            <>
              <Avatar label={directPerson.name} color={directPerson.color} small/>
              <span className="direct-chat-label"><Icon name="check" size={13}/> Conectados</span>
            </>
          ) : (
            <>
              <Avatar label="Diego R" color="violet" small/>
              <Avatar label="Lucía M" color="mint" small/>
              <Avatar label="Carlos M" color="coral" small/>
              <Button variant="ghost" onClick={onLeave}>
                <Icon name="logout" size={17}/> Salir del emprendimiento
              </Button>
            </>
          )}
        </div>
      </header>

      <div className="messages">
        <div className="day-divider">HOY</div>
        {messages.map((m, i) => (
          <div className={`message ${m.own ? 'own' : ''} ${m.system ? 'system' : ''}`} key={i}>
            {!m.own && !m.system && <Avatar label={m.name} color="violet" small/>}
            <div>
              {m.system && <Icon name="spark"/>}
              <b>{m.system ? 'Equipo conectado con éxito' : m.name}</b>
              <p>{m.text}</p>
              <small>{m.time}</small>
            </div>
          </div>
        ))}
      </div>

      <footer>
        <div>
          <button aria-label="Adjuntar"><Icon name="plus"/></button>
          <input 
            value={message} 
            onChange={e => setMessage(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && send()} 
            placeholder="Escribe un mensaje al equipo…"
          />
          <button className="send" onClick={send} aria-label="Enviar">
            <Icon name="send" size={18}/>
          </button>
        </div>
        <small>{enlaceWhatsapp ? 'Grupo de WhatsApp sincronizado con el proyecto' : 'Coordina reuniones y primeros acuerdos con tu equipo'}</small>
      </footer>
    </section>
  </div>;
}
