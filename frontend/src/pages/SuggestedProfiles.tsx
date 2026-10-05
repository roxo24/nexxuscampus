import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { Button, Avatar, Logo } from '../components/ui';
import { talent as initialTalent } from '../data/mock';
import { getTalento, smartMatchComplementario } from '../services/api';

export function SuggestedProfiles({ 
  student, 
  onContinue, 
  onBack 
}: { 
  student?: any; 
  onContinue: (connections: number[]) => void; 
  onBack: () => void 
}) {
  const [talentos, setTalentos] = useState<any[]>(initialTalent);
  const [connected, setConnected] = useState<number[]>([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        if (student?.carrera) {
          const recs = await smartMatchComplementario(
            student.carrera,
            student.hard_skills || student.skills || []
          );
          if (recs && recs.length > 0) {
            setTalentos(recs);
            return;
          }
        }
        const data = await getTalento();
        if (data && data.length > 0) {
          setTalentos(data);
        }
      } catch (e) {
        console.log('SuggestedProfiles: usando talentos locales');
      }
    }
    cargar();
  }, [student]);

  const sendConnection = (person: any) => {
    if (connected.includes(person.id)) return;
    setConnected(current => [...current, person.id]);
    setNotice(`${person.name || 'Estudiante'} recibió tu solicitud de conexión.`);
    window.setTimeout(() => setNotice(''), 3200);
  };

  return <main className="suggestions-screen">
    <header className="suggestions-header">
      <Logo/>
      <div className="suggestions-progress">
        <span><i/></span>
        <small>Perfil activado · Recomendaciones listas</small>
      </div>
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
        {talentos.map(person => {
          const isConnected = connected.includes(person.id);
          const skills = Array.isArray(person?.skills) ? person.skills : [];
          return <article className={`suggestion-row ${isConnected ? 'connected' : ''}`} key={person.id || person.name}>
            <div className="suggestion-avatar">
              <Avatar label={person.name || 'NC'} color={person.color || 'violet'}/>
              <span>{person.match || 90}%</span>
            </div>
            <div className="suggestion-person">
              <h2>{person.name || 'Estudiante'}</h2>
              <p>{person.career || 'Universidad'} · {person.cycle || '7.º ciclo'}</p>
              <div>
                {skills.map((skill: string) => <span key={skill}>{skill}</span>)}
              </div>
            </div>
            <div className="suggestion-action">
              <button className={isConnected ? 'is-connected' : ''} disabled={isConnected} onClick={() => sendConnection(person)}>
                {isConnected && <Icon name="check" size={15}/>} {isConnected ? 'Solicitud enviada' : 'Conectar'}
              </button>
            </div>
          </article>;
        })}
      </div>
      <div className="suggestions-summary">
        <span>
          {connected.length > 0 
            ? `${connected.length} conexión${connected.length > 1 ? 'es' : ''} seleccionada${connected.length > 1 ? 's' : ''}` 
            : 'Puedes continuar sin conectar todavía'}
        </span>
        <Button icon="arrow" onClick={() => onContinue(connected)}>Ver detalles</Button>
      </div>
    </section>
    {notice && (
      <div className="connection-toast" role="status">
        <span><Icon name="check" size={17}/></span>
        <div><b>Notificación enviada</b><p>{notice}</p></div>
        <button aria-label="Cerrar" onClick={() => setNotice('')}><Icon name="x" size={16}/></button>
      </div>
    )}
  </main>;
}
