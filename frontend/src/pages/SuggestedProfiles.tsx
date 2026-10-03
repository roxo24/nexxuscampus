import { useState } from 'react';
import { Icon } from '../components/Icon';
import { Button, Avatar, Logo } from '../components/ui';
import { talent } from '../data/mock';

export function SuggestedProfiles({ onContinue, onBack }: { onContinue: (connections: number[]) => void; onBack: () => void }) {
  const [connected, setConnected] = useState<number[]>([]);
  const [notice, setNotice] = useState('');
  const sendConnection = (person: typeof talent[number]) => {
    if (connected.includes(person.id)) return;
    setConnected(current => [...current, person.id]);
    setNotice(`${person.name} recibió tu solicitud de conexión.`);
    window.setTimeout(() => setNotice(''), 3200);
  };
  return <main className="suggestions-screen">
    <header className="suggestions-header">
      <Logo/>
      <div className="suggestions-progress"><span><i/></span><small>Perfil activado · Recomendaciones listas</small></div>
      <button onClick={() => onContinue([])}>Omitir</button>
    </header>
    <section className="suggestions-content">
      <div className="suggestions-intro">
        <button className="suggestions-back" aria-label="Volver" onClick={onBack}><Icon name="chevronLeft" size={20}/></button>
        <div className="eyebrow">SELECCIONADOS POR IA</div>
        <h1>Conecta con personas que pueden impulsar tu siguiente idea</h1>
        <p>Encontramos perfiles complementarios a tus habilidades y objetivos. Puedes conectar ahora o descubrirlos más adelante.</p>
      </div>
      <div className="suggestions-list">
        {talent.map(person => {
          const isConnected = connected.includes(person.id);
          return <article className={`suggestion-row ${isConnected ? 'connected' : ''}`} key={person.id}>
            <div className="suggestion-avatar"><Avatar label={person.name} color={person.color}/><span>{person.match}%</span></div>
            <div className="suggestion-person"><h2>{person.name}</h2><p>{person.career} · {person.cycle}</p><div>{person.skills.map(skill => <span key={skill}>{skill}</span>)}</div></div>
            <div className="suggestion-action">
              <button className={isConnected ? 'is-connected' : ''} disabled={isConnected} onClick={() => sendConnection(person)}>{isConnected && <Icon name="check" size={15}/>} {isConnected ? 'Solicitud enviada' : 'Conectar'}</button>
            </div>
          </article>;
        })}
      </div>
      <div className="suggestions-summary"><span>{connected.length > 0 ? `${connected.length} conexión${connected.length > 1 ? 'es' : ''} seleccionada${connected.length > 1 ? 's' : ''}` : 'Puedes continuar sin conectar todavía'}</span><Button icon="arrow" onClick={() => onContinue(connected)}>Ver detalles</Button></div>
    </section>
    {notice && <div className="connection-toast" role="status"><span><Icon name="check" size={17}/></span><div><b>Notificación enviada</b><p>{notice}</p></div><button aria-label="Cerrar" onClick={() => setNotice('')}><Icon name="x" size={16}/></button></div>}
  </main>;
}
