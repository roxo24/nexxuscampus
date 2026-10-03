import { Icon } from './Icon';
import { Button, Avatar, Stars } from './ui';
import { talent } from '../data/mock';

export function TalentCard({ person, onInvite }: { person: typeof talent[number]; onInvite: () => void }) {
  return <article className="talent-card">
    <div className="talent-top"><Avatar label={person.name} color={person.color}/><span className="match">{person.match}% match</span></div>
    <div><h3>{person.name}</h3><p>{person.career} · {person.cycle}</p></div>
    <div className="mini-chips">{person.skills.map(x => <span key={x}>{x}</span>)}</div>
    <div className="talent-proof"><span><Icon name="spark" size={15}/> Responde rápido</span><span>3 proyectos</span></div>
    <div className="talent-bottom"><span><Stars value={person.rating}/> <b>{person.rating}</b></span><Button variant="secondary" onClick={onInvite}>Invitar</Button></div>
  </article>;
}
