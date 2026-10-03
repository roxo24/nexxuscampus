import { useState } from 'react';
import { Icon } from './Icon';
import { Button, Field, Avatar, Stars } from './ui';
import { talent } from '../data/mock';

export function InviteModal({ person, onClose, onSent }: { person: typeof talent[number]; onClose: () => void; onSent: () => void }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={e => e.stopPropagation()}><button className="modal-close" onClick={onClose}><Icon name="x"/></button><div className="modal-icon"><Icon name="send"/></div><h2>Invitar a {person.name}</h2><p>Envía una invitación clara y personal. La institución seguirá siendo privada.</p><Field label="Proyecto"><select><option>Vitrina Circular</option><option>Aula Nómada</option></select></Field><Field label="Mensaje introductorio"><textarea rows={4} defaultValue={`Hola, ${person.name}. Tu experiencia en ${person.skills[0]} encaja muy bien con el próximo hito de nuestro proyecto.`}/></Field><div className="button-row"><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button icon="send" onClick={onSent}>Enviar solicitud</Button></div></div></div>;
}

export function Notifications({ close, onAccept }: { close: () => void; onAccept: (project: string) => void }) {
  return <><div className="drawer-backdrop" onClick={close}/><aside className="notification-drawer"><header><div><h2>Notificaciones</h2><p>4 nuevas desde tu última visita</p></div><button onClick={close}><Icon name="x"/></button></header><div className="notification-tabs"><button className="active">Todas <span>4</span></button><button>Invitaciones</button><button>Actividad</button></div><div className="notification-list">
    <article className="notification unread"><Avatar label="Aula Nómada" color="coral" small/><div><span className="status pending">Pendiente</span><p>El proyecto <b>Aula Nómada</b> te ha invitado para el rol de <b>UX Research</b>.</p><small>Hace 8 minutos</small><div><Button onClick={() => onAccept('Aula Nómada')}>Aceptar</Button><Button variant="secondary">Rechazar</Button></div></div></article>
    <article className="notification"><Avatar label="Diego R" color="violet" small/><div><span className="status active">Aceptada</span><p><b>Diego R.</b> ha aceptado tu invitación a Vitrina Circular.</p><small>Hace 1 hora</small></div></article>
    <article className="notification"><Avatar label="Proyecto" color="amber" small/><div><span className="status expired">Posición cubierta</span><p>La posición de Backend en Nexo Salud ya fue cubierta por otro estudiante.</p><small>Ayer</small></div></article>
  </div></aside></>;
}

export function Offboarding({ close }: { close: () => void }) {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('');
  const reasons = ['Carga académica','Pérdida de interés en la temática','Falta de comunicación interna','Desacuerdo con las decisiones del equipo','Incumplimiento de tareas pactadas'];
  return <div className="modal-backdrop locked"><div className="modal offboarding"><div className="modal-icon danger"><Icon name="logout"/></div><div className="eyebrow">SALIDA DEL EQUIPO · PASO {step} DE 2</div><h2>{step === 1 ? 'Antes de salir, ayúdanos a entender' : 'Reseña constructiva de personas'}</h2><p>{step === 1 ? 'Tu respuesta nos permite mejorar la formación de futuros equipos. Esta información será confidencial.' : 'Tu evaluación será anónima y ayudará a construir equipos más saludables.'}</p>{step === 1 ? <div className="radio-list">{reasons.map(r => <label key={r}><input type="radio" name="reason" checked={reason===r} onChange={() => setReason(r)}/><span>{r}</span></label>)}</div> : <div className="ratings">{['Puntualidad','Aporte técnico','Trato humano'].map(x => <div key={x}><span><b>{x}</b><small>Califica tu experiencia</small></span><Stars value={5} editable/></div>)}</div>}<div className="button-row"><Button variant="secondary" onClick={close}>Permanecer en el equipo</Button><Button variant="danger" disabled={step===1 && !reason} onClick={() => step===1 ? setStep(2) : close()}>{step===1?'Confirmar motivo y continuar':'Finalizar salida'}</Button></div></div></div>;
}
