import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { Button, Field, Avatar, Stars } from './ui';
import { talent } from '../data/mock';
import { 
  enviarSolicitudMatch, 
  getNotificaciones, 
  responderSolicitud, 
  getMotivosSalida, 
  registrarSalidaProyecto 
} from '../services/api';

export function InviteModal({ person, onClose, onSent }: { person: typeof talent[number]; onClose: () => void; onSent: () => void }) {
  const [projectTitle, setProjectTitle] = useState('Vitrina Circular');
  const [message, setMessage] = useState(`Hola, ${person.name}. Tu experiencia en ${person.skills[0] || 'tu área'} encaja muy bien con el próximo hito de nuestro proyecto.`);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      await enviarSolicitudMatch(1, person.id, 1, message);
    } catch (err) {
      console.warn('Invitación registrada localmente:', err);
    } finally {
      setLoading(false);
      onSent();
    }
  };

  return <div className="modal-backdrop" onMouseDown={onClose}>
    <div className="modal" onMouseDown={e => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}><Icon name="x"/></button>
      <div className="modal-icon"><Icon name="send"/></div>
      <h2>Invitar a {person.name}</h2>
      <p>Envía una invitación clara y personal. La institución seguirá siendo privada hasta conectar.</p>
      <Field label="Proyecto">
        <select value={projectTitle} onChange={e => setProjectTitle(e.target.value)}>
          <option>Vitrina Circular</option>
          <option>AgroSmart Piura</option>
          <option>Aula Nómada</option>
        </select>
      </Field>
      <Field label="Mensaje introductorio">
        <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)}/>
      </Field>
      <div className="button-row">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button icon="send" disabled={loading} onClick={handleSend}>
          {loading ? 'Enviando…' : 'Enviar solicitud'}
        </Button>
      </div>
    </div>
  </div>;
}

export function Notifications({ close, onAccept }: { close: () => void; onAccept: (project: string) => void }) {
  const [notifs, setNotifs] = useState<any[]>([
    {
      id: 1,
      titulo: 'Nueva invitación de equipo',
      mensaje: 'El proyecto Aula Nómada te ha invitado para el rol de UX Research.',
      tiempo: 'Hace 8 minutos',
      estado: 'Pendiente',
      proyecto_nombre: 'Aula Nómada',
      unread: true
    },
    {
      id: 2,
      titulo: 'Invitación aceptada',
      mensaje: 'Diego R. ha aceptado tu invitación a Vitrina Circular.',
      tiempo: 'Hace 1 hora',
      estado: 'Aceptada',
      proyecto_nombre: 'Vitrina Circular',
      unread: false
    }
  ]);

  useEffect(() => {
    async function cargar() {
      try {
        const data = await getNotificaciones(2); // Usuario 2 en demo tiene notificaciones en BD
        if (data && data.length > 0) {
          const mapped = data.map((n: any) => ({
            id: n.id,
            solicitud_id: n.solicitud_id,
            titulo: n.titulo,
            mensaje: n.mensaje,
            tiempo: n.fecha_creacion ? n.fecha_creacion.slice(11, 16) : 'Reciente',
            estado: n.solicitud_estado || 'Pendiente',
            proyecto_nombre: n.proyecto_nombre || 'Proyecto UNP',
            unread: !n.leida
          }));
          setNotifs(mapped);
        }
      } catch (err) {
        console.log('Mostrando notificaciones locales');
      }
    }
    cargar();
  }, []);

  const handleAction = async (item: any, accion: 'aceptar' | 'rechazar') => {
    if (item.solicitud_id) {
      try {
        await responderSolicitud(item.solicitud_id, accion);
      } catch (e) {
        console.warn('Acción registrada localmente');
      }
    }
    setNotifs(prev => prev.map(n => n.id === item.id ? { ...n, estado: accion === 'aceptar' ? 'Aceptada' : 'Rechazada', unread: false } : n));
    if (accion === 'aceptar') {
      onAccept(item.proyecto_nombre);
    }
  };

  return <>
    <div className="drawer-backdrop" onClick={close}/>
    <aside className="notification-drawer">
      <header>
        <div>
          <h2>Notificaciones</h2>
          <p>{notifs.filter(n => n.unread).length} nuevas solicitudes</p>
        </div>
        <button onClick={close}><Icon name="x"/></button>
      </header>
      <div className="notification-tabs">
        <button className="active">Todas <span>{notifs.length}</span></button>
        <button>Invitaciones</button>
        <button>Actividad</button>
      </div>
      <div className="notification-list">
        {notifs.map(n => (
          <article className={`notification ${n.unread ? 'unread' : ''}`} key={n.id}>
            <Avatar label={n.proyecto_nombre} color="coral" small/>
            <div>
              <span className={`status ${n.estado === 'Aceptada' ? 'active' : n.estado === 'Rechazada' ? 'expired' : 'pending'}`}>
                {n.estado}
              </span>
              <p>{n.mensaje}</p>
              <small>{n.tiempo}</small>
              {n.estado === 'Pendiente' && (
                <div>
                  <Button onClick={() => handleAction(n, 'aceptar')}>Aceptar</Button>
                  <Button variant="secondary" onClick={() => handleAction(n, 'rechazar')}>Rechazar</Button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </aside>
  </>;
}

export function Offboarding({ close }: { close: () => void }) {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('Incompatibilidad de horarios / Carga académica');
  const [motivosLista, setMotivosLista] = useState<string[]>([
    'Incompatibilidad de horarios / Carga académica',
    'Pérdida de interés en la temática del proyecto',
    'Falta de comunicación interna del equipo',
    'Desacuerdo con las decisiones del líder/equipo',
    'Incumplimiento de tareas pactadas'
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function cargarMotivos() {
      try {
        const data = await getMotivosSalida();
        if (data && data.length > 0) {
          setMotivosLista(data.map((m: any) => m.nombre));
          setReason(data[0].nombre);
        }
      } catch (err) {
        console.log('Motivos de salida cargados desde catálogo base');
      }
    }
    cargarMotivos();
  }, []);

  const handleFinalizar = async () => {
    setLoading(true);
    try {
      await registrarSalidaProyecto(1, 1, 1, reason);
    } catch (e) {
      console.warn('Salida registrada localmente');
    } finally {
      setLoading(false);
      close();
    }
  };

  return <div className="modal-backdrop locked">
    <div className="modal offboarding">
      <div className="modal-icon danger"><Icon name="logout"/></div>
      <div className="eyebrow">SALIDA DEL EQUIPO · PASO {step} DE 2</div>
      <h2>{step === 1 ? 'Antes de salir, ayúdanos a entender' : 'Reseña constructiva de personas'}</h2>
      <p>{step === 1 ? 'Tu respuesta nos permite mejorar la formación de futuros equipos. Esta información es confidencial.' : 'Tu evaluación será anónima y ayudará a construir equipos más saludables.'}</p>
      
      {step === 1 ? (
        <div className="radio-list">
          {motivosLista.map(r => (
            <label key={r}>
              <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)}/>
              <span>{r}</span>
            </label>
          ))}
        </div>
      ) : (
        <div className="ratings">
          {['Puntualidad','Aporte técnico','Trato humano'].map(x => (
            <div key={x}>
              <span><b>{x}</b><small>Califica tu experiencia</small></span>
              <Stars value={5} editable/>
            </div>
          ))}
        </div>
      )}

      <div className="button-row">
        <Button variant="secondary" onClick={close}>Permanecer en el equipo</Button>
        <Button 
          variant="danger" 
          disabled={loading || (step === 1 && !reason)} 
          onClick={() => step === 1 ? setStep(2) : handleFinalizar()}
        >
          {loading ? 'Procesando…' : step === 1 ? 'Confirmar motivo y continuar' : 'Finalizar salida'}
        </Button>
      </div>
    </div>
  </div>;
}
