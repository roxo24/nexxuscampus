import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { Button, Avatar } from '../components/ui';
import { talent } from '../data/mock';

export function Messages({ onLeave, initialProject }: { onLeave: () => void; initialProject: string }) {
  const [activeRoom, setActiveRoom] = useState(initialProject);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([{ own: false, name: 'NexusCampus', text: `¡Conexión confirmada! Ya puedes conversar con ${initialProject} y comenzar a coordinar.`, time: 'Ahora', system: true },{ own: false, name: initialProject, text: '¡Hola! Me alegra que hayamos conectado. Cuéntame más sobre lo que te gustaría construir.', time: 'Ahora' }]);
  useEffect(() => setActiveRoom(initialProject), [initialProject]);
  const send = () => { if (message.trim()) { setMessages([...messages, { own: true, name: 'Tú', text: message, time: 'Ahora' }]); setMessage(''); } };
  const baseRooms = [['Vitrina Circular','Diego: Revisé el brief…','10:28','2'],['Aula Nómada','Nuevo equipo conectado','Ahora','1'],['Comunidad Nexus','Nuevo evento este viernes','Lun','']];
  const rooms = baseRooms.some(room => room[0] === initialProject) ? baseRooms : [[initialProject,'Conexión nueva · Chat disponible','Ahora','1'],...baseRooms];
  const directPerson = talent.find(person => person.name === activeRoom);
  return <div className="chat-layout chat-polished">
    <aside className="rooms"><div className="rooms-head"><h2>Mensajes</h2><button><Icon name="plus"/></button></div><div className="room-search"><Icon name="search" size={16}/><input placeholder="Buscar conversación"/></div>
      {rooms.map(r => <button className={`room ${activeRoom===r[0]?'active':''}`} onClick={() => setActiveRoom(r[0])} key={r[0]}><div className="project-logo">{r[0].split(' ').map(x=>x[0]).join('').slice(0,2)}</div><span><b>{r[0]}</b><small>{r[1]}</small></span><em>{r[2]}{r[3] && <i>{r[3]}</i>}</em></button>)}
    </aside>
    <section className="conversation"><header><div><div className="project-logo">{activeRoom.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><span><h2>{activeRoom}</h2><p><i/> {directPerson ? 'Conexión confirmada · Chat directo' : 'Nuevo chat de equipo · 4 integrantes'}</p></span></div><div className="chat-members">{directPerson ? <><Avatar label={directPerson.name} color={directPerson.color} small/><span className="direct-chat-label"><Icon name="check" size={13}/> Conectados</span></> : <><Avatar label="Diego R" color="violet" small/><Avatar label="Lucía M" color="mint" small/><Avatar label="Camila T" color="coral" small/><Button variant="ghost" onClick={onLeave}><Icon name="logout" size={17}/> Salir del emprendimiento</Button></>}</div></header>
      <div className="messages"><div className="day-divider">HOY</div>{messages.map((m,i) => <div className={`message ${m.own?'own':''} ${m.system?'system':''}`} key={i}>{!m.own && !m.system && <Avatar label={m.name} color="violet" small/>}<div>{m.system && <Icon name="spark"/>}<b>{m.system ? 'Equipo conectado con éxito' : m.name}</b><p>{m.text}</p><small>{m.time}</small></div></div>)}</div>
      <footer><div><button aria-label="Adjuntar"><Icon name="plus"/></button><input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Escribe un mensaje al equipo…"/><button className="send" onClick={send} aria-label="Enviar"><Icon name="send" size={18}/></button></div><small>Diego está escribiendo…</small></footer>
    </section>
  </div>;
}
