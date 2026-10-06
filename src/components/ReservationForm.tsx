import { useState, type FormEvent } from 'react';
import { ArrowRight, Check, RotateCcw } from 'lucide-react';

type Reservation = {
  name: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  message: string;
};

export default function ReservationForm() {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState('');
  const [persisted, setPersisted] = useState(true);
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const request: Reservation = {
      name: String(form.get('name') || '').trim(),
      email: String(form.get('email') || '').trim(),
      date: String(form.get('date') || ''),
      time: String(form.get('time') || ''),
      guests: String(form.get('guests') || '2'),
      message: String(form.get('message') || '').trim(),
    };
    if (!request.name || !request.email) {
      setError('Please enter your name and email address.');
      return;
    }
    if (new Date(`${request.date}T${request.time}`).getTime() <= Date.now()) {
      setError('Please choose a date and time in the future.');
      return;
    }
    try {
      const stored: unknown = JSON.parse(localStorage.getItem('beanora-reservations') || '[]');
      const previous = Array.isArray(stored) ? stored.slice(-19) : [];
      localStorage.setItem('beanora-reservations', JSON.stringify([...previous, { ...request, id: Date.now() }]));
      setPersisted(true);
    } catch {
      setPersisted(false);
    }
    setReservation(request);
    setError('');
  }

  if (reservation) {
    const date = new Date(`${reservation.date}T${reservation.time}`);
    return (
      <div className="reservation-success" role="status">
        <span className="reservation-check"><Check size={26} /></span>
        <h3>A cozy spot, noted.</h3>
        <p>Thank you, {reservation.name.split(' ')[0]}. Your request for {reservation.guests} {reservation.guests === '1' ? 'guest' : 'guests'} is {persisted ? 'saved on this device' : 'saved for this visit'}.</p>
        <p className="reservation-date">{date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}<br />{date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
        <p className="demo-note">This is a demo reservation. No request or email has been sent to a cafe.</p>
        <button className="text-button light-text" onClick={() => setReservation(null)}><RotateCcw size={14} /> Make another reservation</button>
      </div>
    );
  }

  return (
    <form className="reservation-form" onSubmit={submit} onChange={() => setError('')}>
      <div className="form-row">
        <label><span className="sr-only">Your name</span><input name="name" autoComplete="name" placeholder="Your name" maxLength={80} required /></label>
        <label><span className="sr-only">Email address</span><input name="email" type="email" autoComplete="email" placeholder="Email address" maxLength={120} required /></label>
      </div>
      <div className="form-row reservation-date-row">
        <label><span className="field-label">Your day</span><input name="date" type="date" min={today} required aria-label="Reservation date" /></label>
        <label><span className="field-label">Your time</span><select name="time" defaultValue="10:00" aria-label="Reservation time">
          {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => <option key={time} value={time}>{new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</option>)}
        </select></label>
        <label><span className="field-label">Your people</span><select name="guests" defaultValue="2" aria-label="Number of guests">
          {[1, 2, 3, 4, 5, 6].map((guests) => <option key={guests} value={guests}>{guests} {guests === 1 ? 'guest' : 'guests'}</option>)}
        </select></label>
      </div>
      <label><span className="sr-only">Special requests</span><textarea name="message" rows={2} placeholder="Anything we should know? (optional)" maxLength={600} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="button button-clay reservation-submit">Save my reservation <ArrowRight size={16} /></button>
      <p className="reservation-disclaimer">Demo booking. Your request is saved locally, not sent to a cafe.</p>
    </form>
  );
}