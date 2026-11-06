import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EVENTO, WHATSAPP } from './config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  template: `
  @if (!abierta()) {
    <main class="portada">
      <div class="arco"><img src="assets/foto.jpg" alt="Cumpleañero"></div>
      <h1>Estás invitado</h1>
      <p class="sub">a celebrar el cumpleaños de</p>
      <p class="nombre">{{ e.nombre }}</p>
      <button class="btn" (click)="abrir()">Abrir invitación</button>
    </main>
  } @else {
    <main class="detalle">
      <section class="bloque">
        <p class="sub">{{ e.fechaTexto }}</p>
        <h2>{{ e.hora }}</h2>

        <div class="crono" aria-live="off">
          @for (u of unidades(); track u.l) {
            <div><b>{{ u.v }}</b><span>{{ u.l }}</span></div>
          }
        </div>
      </section>

      <section class="bloque">
        <p class="sub">Dónde</p>
        <h3>{{ e.direccion }}</h3>
        <p class="nota">{{ e.nota }}</p>
        <a class="btn ghost" [href]="e.mapsUrl" target="_blank" rel="noopener">Ver en el mapa</a>
      </section>

      <section class="bloque">
        <p class="sub">Confirma tu asistencia</p>
        @if (enviado()) {
          <p class="gracias">¡Gracias, {{ nombre }}! Si no se abrió WhatsApp, toca de nuevo el botón.</p>
        } @else {
          <form (ngSubmit)="enviar()" #f="ngForm">
            <label>Tu nombre
              <input name="nombre" [(ngModel)]="nombre" required autocomplete="name">
            </label>
            <label>¿Cuántas personas asisten?
              <select name="n" [(ngModel)]="asistentes">
                @for (n of [1,2,3,4,5,6]; track n) { <option [value]="n">{{ n }}</option> }
              </select>
            </label>
            <label>Nombres de los acompañantes
              <input name="ac" [(ngModel)]="acompanantes" placeholder="Opcional">
            </label>
            <label>Mensaje
              <textarea name="m" [(ngModel)]="mensaje" rows="2" placeholder="Opcional"></textarea>
            </label>
            <button class="btn" type="submit" [disabled]="!nombre.trim()">
              Confirmar por WhatsApp
            </button>
          </form>
        }
      </section>
    </main>
  }
  `,
  styles: [`
    :host { display:block; min-height:100dvh;
      background: radial-gradient(120% 80% at 50% 0%, var(--noche-2), var(--noche) 70%); }
    main { max-width: 440px; margin: 0 auto; padding: max(28px, env(safe-area-inset-top)) 24px max(40px, env(safe-area-inset-bottom)); text-align:center; }
    .portada { min-height:100dvh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; animation: entra 1.2s ease both; }
    @keyframes entra { from { opacity:0; transform: scale(.97);} to { opacity:1; transform:none;} }
    .arco { width:min(68vw,260px); aspect-ratio:3/4; border-radius:999px 999px 14px 14px; padding:7px;
      border:1px solid var(--oro); margin-bottom:28px; }
    .arco img { width:100%; height:100%; object-fit:cover; object-position:50% 30%; border-radius:999px 999px 8px 8px; display:block; }
    h1 { font-family:var(--serif); font-weight:500; font-size:clamp(2.6rem,13vw,3.6rem); line-height:1; color:var(--oro-claro); }
    h2 { font-family:var(--serif); font-weight:500; font-size:3rem; color:var(--oro-claro); line-height:1.1; }
    h3 { font-family:var(--serif); font-weight:500; font-size:2rem; color:var(--marfil); }
    .sub { font-size:.85rem; letter-spacing:.12em; color:var(--rosa); margin-bottom:6px; }
    .nombre { font-family:var(--serif); font-style:italic; font-size:2rem; margin-bottom:28px; }
    .btn { display:inline-block; font:500 .95rem var(--sans); letter-spacing:.08em; color:var(--noche); background:linear-gradient(135deg,var(--oro-claro),var(--oro));
      border:0; border-radius:999px; padding:15px 34px; text-decoration:none; cursor:pointer; min-height:48px; }
    .btn.ghost { background:none; color:var(--oro-claro); border:1px solid var(--oro); margin-top:18px; }
    .btn:disabled { opacity:.5; }
    .btn:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible { outline:2px solid var(--oro-claro); outline-offset:3px; }
    .detalle { display:flex; flex-direction:column; gap:20px; animation: entra .8s ease both; }
    .bloque { padding:34px 22px; border:1px solid rgba(201,169,110,.35); border-radius:22px; }
    .crono { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-top:26px; }
    .crono b { display:block; font-family:var(--serif); font-weight:500; font-size:2.2rem; color:var(--oro-claro); font-variant-numeric:tabular-nums; }
    .crono span { font-size:.72rem; letter-spacing:.1em; color:var(--rosa); }
    .nota { margin-top:8px; font-family:var(--serif); font-style:italic; font-size:1.2rem; color:var(--rosa); }
    form { display:flex; flex-direction:column; gap:14px; text-align:left; margin-top:14px; }
    label { font-size:.85rem; color:var(--oro-claro); display:flex; flex-direction:column; gap:6px; }
    input, select, textarea { font:300 1rem var(--sans); color:var(--marfil); background:rgba(245,239,227,.06);
      border:1px solid rgba(201,169,110,.4); border-radius:12px; padding:12px 14px; }
    select option { color:#000; }
    form .btn { margin-top:6px; align-self:center; }
    .gracias { font-family:var(--serif); font-size:1.5rem; margin-top:10px; }
    .error { color:#f0a5a5; font-size:.9rem; }
  `],
})
export class AppComponent implements OnInit, OnDestroy {
  e = EVENTO;
  abierta = signal(false);
  unidades = signal<{ v: string; l: string }[]>([]);
  enviado = signal(false);
  nombre = '';
  asistentes = '1';
  acompanantes = '';
  mensaje = '';
  private t?: ReturnType<typeof setInterval>;

  ngOnInit() { this.tick(); this.t = setInterval(() => this.tick(), 1000); }
  ngOnDestroy() { clearInterval(this.t); }

  abrir() { this.abierta.set(true); window.scrollTo(0, 0); }

  private tick() {
    let s = Math.max(0, Math.floor((this.e.fecha.getTime() - Date.now()) / 1000));
    const d = Math.floor(s / 86400); s %= 86400;
    const h = Math.floor(s / 3600); s %= 3600;
    const m = Math.floor(s / 60); s %= 60;
    const p = (n: number) => String(n).padStart(2, '0');
    this.unidades.set([{ v: String(d), l: 'días' }, { v: p(h), l: 'horas' }, { v: p(m), l: 'min' }, { v: p(s), l: 'seg' }]);
  }

  enviar() {
    const n = this.asistentes;
    const texto =
      `Hola, soy ${this.nombre.trim()} y confirmo mi asistencia al cumpleaños de ${this.e.nombre} ` +
      `(${this.e.fechaTexto}, ${this.e.hora}).\n` +
      `Personas: ${n}` +
      (this.acompanantes.trim() ? `\nAcompañantes: ${this.acompanantes.trim()}` : '') +
      (this.mensaje.trim() ? `\nMensaje: ${this.mensaje.trim()}` : '');
    this.enviado.set(true);
    window.location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
  }
}
