import { useState } from "react";
import { UserX as UserXIcon } from "lucide-react";

const TABS = [
  { id: "problema", label: "El problema" },
  { id: "arquitectura", label: "Arquitectura" },
  { id: "web", label: "WEB — React" },
  { id: "app", label: "APP — Nativa" },
  { id: "contrato", label: "Contrato backend" },
];

const Code = ({ children }) => (
  <pre style={{
    background: "rgba(0,0,0,0.06)", border: "1px solid var(--color-border-tertiary)",
    borderRadius: 8, padding: "0.85rem 1rem", fontSize: 12, lineHeight: 1.75,
    overflowX: "auto", color: "var(--color-text-secondary)",
    fontFamily: "'JetBrains Mono','Fira Code',monospace", margin: "0.6rem 0",
  }}><code>{children}</code></pre>
);

const Badge = ({ color, children }) => {
  const map = {
    green: ["#0f6e56", "#9fe1cb"], blue: ["#185fa5", "#b5d4f4"],
    amber: ["#854f0b", "#fac775"], coral: ["#993c1d", "#f5c4b3"],
    purple: ["#534ab7", "#cecbf6"], gray: ["#5f5e5a", "#d3d1c7"],
    teal: ["#0f6e56", "#9fe1cb"],
  };
  const [bg, fg] = map[color] || map.gray;
  return (
    <span style={{
      background: bg, color: fg, padding: "2px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase",
      display: "inline-block"
    }}>{children}</span>
  );
};

const Card = ({ title, badge, badgeColor = "blue", children, accent }) => (
  <div style={{
    borderRadius: 10, border: "1px solid var(--color-border-tertiary)",
    borderLeft: accent ? `4px solid ${accent}` : undefined,
    padding: "1rem 1.2rem", background: "var(--color-background-secondary)",
    marginBottom: "0.85rem"
  }}>
    {(title || badge) && (
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.6rem" }}>
        {badge && <Badge color={badgeColor}>{badge}</Badge>}
        {title && <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--color-text-primary)" }}>{title}</span>}
      </div>
    )}
    {children}
  </div>
);

const SectionTitle = ({ label, tag }) => (
  <div style={{ marginBottom: "1.25rem" }}>
    {tag && <div style={{
      fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
      color: "var(--color-text-tertiary)", marginBottom: 5
    }}>{tag}</div>}
    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", lineHeight: 1.2 }}>{label}</h2>
    <div style={{ marginTop: 7, height: 3, width: 40, background: "#1D9E75", borderRadius: 2 }} />
  </div>
);

const Row = ({ children }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: `repeat(${Array.isArray(children) ? children.length : 1},1fr)`,
    gap: "0.85rem"
  }}>{children}</div>
);

const Tabs2 = ({ tabs, active, onChange }) => (
  <div style={{ display: "flex", gap: 5, marginBottom: "0.85rem", flexWrap: "wrap" }}>
    {tabs.map((t, i) => (
      <button key={i} onClick={() => onChange(i)} style={{
        padding: "4px 13px", borderRadius: 20,
        border: "1px solid var(--color-border-tertiary)",
        background: active === i ? "#1D9E75" : "var(--color-background-secondary)",
        color: active === i ? "#fff" : "var(--color-text-secondary)",
        fontSize: 12, fontWeight: 600, cursor: "pointer",
      }}>{t}</button>
    ))}
  </div>
);

function SecProblema() {
  return (
    <div>
      <SectionTitle tag="Contexto" label="El problema: sesión revocada sin notificación" />
      <Card accent="#D85A30">
        <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: 13.5, lineHeight: 1.8 }}>
          Metro de Medellín maneja una política de <strong style={{ color: "var(--color-text-primary)" }}>single session</strong>: un usuario solo puede tener una sesión activa. Al iniciar sesión desde un segundo dispositivo, el token anterior es revocado en el backend. El problema: <strong style={{ color: "var(--color-text-primary)" }}>el cliente original no se entera</strong> hasta que falla una petición.
        </p>
      </Card>
      <Row>
        <Card badge="Flujo actual" badgeColor="coral">
          <ol style={{ margin: 0, paddingLeft: 16, color: "var(--color-text-secondary)", fontSize: 13, lineHeight: 2.1 }}>
            <li>Device A inicia sesión → token válido</li>
            <li>Mismo usuario inicia sesión en <strong style={{ color: "var(--color-text-primary)" }}>Device B</strong></li>
            <li>Backend revoca token de Device A en DynamoDB</li>
            <li>Device A sigue activo con un <strong style={{ color: "var(--color-text-primary)" }}>token zombie ❌</strong></li>
            <li>Solo lo detecta cuando falla un request</li>
          </ol>
        </Card>
        <Card badge="Lo que necesitamos" badgeColor="green">
          <ul style={{ margin: 0, paddingLeft: 16, color: "var(--color-text-secondary)", fontSize: 13, lineHeight: 2.1 }}>
            <li>Notificación <strong style={{ color: "var(--color-text-primary)" }}>en tiempo real</strong> al cliente desplazado</li>
            <li>Sin depender de que falle un request</li>
            <li>Funciona con <strong style={{ color: "var(--color-text-primary)" }}>app en background</strong></li>
            <li>UX claro: el usuario sabe qué pasó y qué hacer</li>
            <li>Sin polling (antipatrón — batería + carga)</li>
          </ul>
        </Card>
      </Row>
      <Card badge="Payload de login actual" badgeColor="gray" title="— punto de partida">
        <Code>{`{
  "document_type_code": "CC",
  "document_number":    "1152693885",
  "password":           "PassWord!",
  "client_type":        "APP",   // "APP" | "WEB"
  "device_id":          "uuid-device-A"
}`}</Code>
        <p style={{ margin: "0.4rem 0 0", fontSize: 12, color: "var(--color-text-tertiary)" }}>
          ⚠️ Para APP nativa se debe agregar <code style={{ color: "#1D9E75" }}>fcm_token</code> — ver sección APP.
        </p>
      </Card>
      <Card badge="Referencia de industria" badgeColor="gray">
        <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: 13, lineHeight: 1.8 }}>
          Bancolombia implementa exactamente este patrón. Al iniciar sesión en un segundo dispositivo,
          la primera sesión recibe <strong style={{ color: "var(--color-text-primary)" }}>en tiempo real</strong> la pantalla:{" "}
          <em>"Tienes otra sesión abierta — Cerraremos esta sesión para proteger tu información"</em>.
          Nuestro sistema busca el mismo comportamiento.
        </p>
      </Card>
    </div>
  );
}

function SecArquitectura() {
  return (
    <div>
      <SectionTitle tag="Diseño de solución" label="Arquitectura de 3 capas" />
      <Card accent="#1D9E75">
        <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: 13.5, lineHeight: 1.8 }}>
          El evento de revocación <strong style={{ color: "var(--color-text-primary)" }}>ya ocurre en DynamoDB</strong>.
          La solución usa <strong style={{ color: "var(--color-text-primary)" }}>DynamoDB Streams</strong> como
          orquestador pasivo — sin modificar el flujo de login — para enrutar notificaciones a cada tipo de cliente.
        </p>
      </Card>
      {[
        {
          badge: "Capa 0", color: "coral", title: "Nuevo login detectado",
          sub: "POST /auth/login → escribe status: REVOKED en la tabla de sesiones DynamoDB. Sin cambios en este flujo."
        },
        {
          badge: "Capa 1", color: "purple", title: "DynamoDB Streams",
          sub: "Detecta automáticamente el cambio en la tabla. Sin polling, sin código adicional en el login."
        },
        {
          badge: "Capa 2", color: "blue", title: "Lambda: session-revocation-dispatcher",
          sub: "Lee el evento del Stream, identifica el client_type (APP / WEB) y enruta al canal correcto."
        },
      ].map((item, i) => (
        <div key={i}>
          <Card badge={item.badge} badgeColor={item.color} title={item.title}>
            <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: 13 }}>{item.sub}</p>
          </Card>
          <div style={{ textAlign: "center", color: "var(--color-text-tertiary)", fontSize: 16, margin: "-4px 0 0" }}>↓</div>
        </div>
      ))}
      <Row>
        <Card badge="Canal WEB" badgeColor="blue" title="API Gateway WebSocket">
          <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: 13, lineHeight: 1.7 }}>
            Conexión persistente serverless. El dispatcher llama al <strong style={{ color: "var(--color-text-primary)" }}>Management API</strong> con
            el <code style={{ color: "#1D9E75" }}>connectionId</code> guardado en la sesión.
          </p>
        </Card>
        <Card badge="Canal APP" badgeColor="green" title="FCM — Firebase Cloud Messaging">
          <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: 13, lineHeight: 1.7 }}>
            Data message silencioso vía FCM. Funciona con la <strong style={{ color: "var(--color-text-primary)" }}>app cerrada o en background</strong>.
            Un solo endpoint para iOS y Android.
          </p>
        </Card>
      </Row>
      <Card badge="Capa base transversal" badgeColor="gray" title="Access token TTL corto (10–15 min)">
        <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: 13 }}>
          Último nivel de defensa. Limita la ventana máxima de exposición si los canales de notificación fallan.
        </p>
      </Card>
    </div>
  );
}

function SecWeb() {
  const [tab, setTab] = useState(0);
  return (
    <div>
      <SectionTitle tag="Implementación — WEB" label="React SPA · API Gateway WebSocket" />
      <Card accent="#185fa5">
        <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: 13.5, lineHeight: 1.8 }}>
          El browser no soporta headers <code style={{ color: "#1D9E75" }}>Authorization</code> en WebSockets (limitación del spec).
          El token viaja en el <strong style={{ color: "var(--color-text-primary)" }}>primer mensaje post-conexión</strong>.
          No se requiere Firebase SDK — solo <code style={{ color: "#1D9E75" }}>new WebSocket()</code> nativo del browser.
        </p>
      </Card>
      <Tabs2 tabs={["Árbol de componentes", "useSessionGuard", "SessionRevokedScreen", "Reconexión"]} active={tab} onChange={setTab} />
      {tab === 0 && (
        <div>
          <Card badge="App.tsx" badgeColor="gray">
            <Code>{`function App() {
  const { revoked } = useSessionGuard()   // hook global

  // render exclusivo: si está revocado, NADA más es visible
  if (revoked) return <SessionRevokedScreen />

  return <RouterProvider router={router} />
}`}</Code>
          </Card>
          <Card badge="AuthProvider" badgeColor="purple" title="— useSessionGuard vive aquí">
            <p style={{ margin: "0 0 0.5rem", color: "var(--color-text-secondary)", fontSize: 13 }}>
              El hook se monta solo cuando hay token válido. Es el único responsable del WebSocket.
            </p>
            <Code>{`export function AuthProvider({ children }) {
  const token = authStore.getToken()        // tu store actual
  if (!token) return <>{children}</>
  return <SessionGuardProvider>{children}</SessionGuardProvider>
}`}</Code>
          </Card>
        </div>
      )}
      {tab === 1 && (
        <Card badge="useSessionGuard.ts" badgeColor="purple">
          <Code>{`import { useState, useEffect, useRef } from "react"

const WS_URL = process.env.NEXT_PUBLIC_WS_ENDPOINT
// ej: wss://xxxxxxxx.execute-api.us-east-1.amazonaws.com/prod

export function useSessionGuard() {
  const [revoked, setRevoked] = useState(false)
  const wsRef = useRef(null)
  const retry = useRef(0)
  const token = authStore.getToken()        // tu store actual

  useEffect(() => {
    if (!token) return

    function connect() {
      const ws = new WebSocket(\`\${WS_URL}?token=\${token}\`)
      wsRef.current = ws

      ws.onopen = () => {
        retry.current = 0
        // Auth en primer mensaje — WebSocket no acepta headers en browser
        ws.send(JSON.stringify({ action: "auth", token }))
      }

      ws.onmessage = ({ data }) => {
        const { type } = JSON.parse(data)
        if (type === "SESSION_REVOKED") {
          setRevoked(true)
          ws.close(1000)
          authStore.logout()               // limpia el store local
        }
      }

      ws.onclose = (e) => {
        if (e.code === 1000 || revoked) return   // cierre limpio, no retry
        const delay = Math.min(1000 * 2 ** retry.current, 30_000)
        retry.current += 1
        setTimeout(connect, delay)               // backoff exponencial
      }

      ws.onerror = () => ws.close()
    }

    connect()
    return () => wsRef.current?.close(1000, "unmounted")
  }, [token])

  return { revoked }
}`}</Code>
        </Card>
      )}
      {tab === 2 && (
        <Card badge="SessionRevokedScreen.tsx" badgeColor="coral" title="— estilo Bancolombia">
          <Code>{`export function SessionRevokedScreen() {
  return (
    <div style={styles.overlay}>
      <div style={styles.card}>

        {/* 1. Ícono de sesión cerrada */}
        <UserXIcon size={48} color="#D85A30" />

        {/* 2. Mensaje claro — el usuario sabe qué pasó */}
        <h2>Tienes otra sesión abierta</h2>

        {/* 3. Cuerpo + escape hatch de seguridad */}
        <p>
          Cerramos esta sesión para proteger tu información.
          Si no fuiste tú,{" "}
          <a href="tel:+576044448338">comunícate con soporte.</a>
        </p>

        {/* 4. CTA de retorno — acción clara */}
        <button onClick={() => navigate("/login")}>
          Volver a iniciar sesión
        </button>

      </div>
    </div>
  )
}`}</Code>
        </Card>
      )}
      {tab === 3 && (
        <div>
          <Card badge="Backoff exponencial" badgeColor="amber">
            <Code>{`// Delay progresivo hasta tope de 30s:
// Intento 1 →  1.000 ms
// Intento 2 →  2.000 ms
// Intento 3 →  4.000 ms
// Intento 4 →  8.000 ms
// Intento 5 → 16.000 ms
// Intento 6+ → tope en 30.000 ms

const delay = Math.min(1000 * 2 ** retry.current, 30_000)

// NO reconectar si:
// ws.close(1000)   → logout manual o SESSION_REVOKED recibido
// revoked === true → sesión terminada intencionalmente`}</Code>
          </Card>
          <Card badge="Nota" badgeColor="coral">
            <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: 13 }}>
              El backend debe enviar <code style={{ color: "#1D9E75" }}>close code 1000</code> al cerrar el WebSocket después
              de enviar el evento, para que el cliente <strong style={{ color: "var(--color-text-primary)" }}>no intente reconectarse</strong>.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}

function SecApp() {
  const [plat, setPlat] = useState(0);
  return (
    <div>
      <SectionTitle tag="Implementación — APP" label="iOS · Android · FCM Silent Push" />
      <Card accent="#3B6D11">
        <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: 13.5, lineHeight: 1.8 }}>
          FCM <strong style={{ color: "var(--color-text-primary)" }}>data messages</strong> (sin título, sin sonido) se entregan
          incluso con la app <strong style={{ color: "var(--color-text-primary)" }}>cerrada o en background</strong>.
          Un solo endpoint de backend para iOS y Android. El SO mantiene el canal — sin impacto en batería.
        </p>
      </Card>
      <Card badge="Paso 1 — ambas plataformas" badgeColor="blue" title="Agregar fcm_token al login">
        <Code>{`// Payload de login actualizado para APP
{
  "document_type_code": "CC",
  "document_number":    "1152693885",
  "password":           "PassWord!",
  "client_type":        "APP",
  "device_id":          "uuid-device-A",
  "fcm_token":          "dGhpcyBpcyBhIHNhbXBsZQ..."   // ← NUEVO

  // Cómo obtener el token:
  // iOS:     Messaging.messaging().token { token, _ in ... }
  // Android: FirebaseMessaging.getInstance().token
  //            .addOnSuccessListener { token -> ... }
}`}</Code>
        <p style={{ margin: "0.4rem 0 0", fontSize: 12, color: "var(--color-text-tertiary)" }}>
          ⚠️ El <code style={{ color: "#1D9E75" }}>fcm_token</code> puede cambiar. Implementar <code style={{ color: "#1D9E75" }}>onNewToken</code> para actualizarlo.
        </p>
      </Card>
      <Tabs2 tabs={["iOS (Swift)", "Android (Kotlin)"]} active={plat} onChange={setPlat} />
      {plat === 0 && (
        <div>
          <Card badge="iOS — Setup Xcode" badgeColor="blue">
            <ul style={{ margin: 0, paddingLeft: 16, color: "var(--color-text-secondary)", fontSize: 13, lineHeight: 2.1 }}>
              <li>Signing & Capabilities → <strong style={{ color: "var(--color-text-primary)" }}>Push Notifications</strong> ✓</li>
              <li>Signing & Capabilities → Background Modes → <strong style={{ color: "var(--color-text-primary)" }}>Remote notifications</strong> ✓</li>
              <li>Firebase Console → Project Settings → subir APNs Key (.p8)</li>
              <li>Agregar <code style={{ color: "#1D9E75" }}>GoogleService-Info.plist</code> al proyecto Xcode</li>
            </ul>
          </Card>
          <Card badge="AppDelegate.swift" badgeColor="purple">
            <Code>{`import FirebaseMessaging

@main class AppDelegate: UIResponder, UIApplicationDelegate {

  func application(_ app: UIApplication,
    didFinishLaunchingWithOptions _: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    FirebaseApp.configure()
    app.registerForRemoteNotifications()
    Messaging.messaging().delegate = self
    return true
  }

  // ⚡ Recibe el silent push — foreground y background
  func application(_ app: UIApplication,
    didReceiveRemoteNotification userInfo: [AnyHashable: Any],
    fetchCompletionHandler complete: @escaping (UIBackgroundFetchResult) -> Void) {

    guard let type = userInfo["type"] as? String,
          type == "SESSION_REVOKED" else { complete(.noData); return }

    SessionManager.shared.clearSession()

    DispatchQueue.main.async {
      NotificationCenter.default.post(name: .sessionRevoked, object: nil)
    }
    complete(.newData)
  }
}

extension AppDelegate: MessagingDelegate {
  // Actualizar fcm_token cuando Firebase lo renueva
  func messaging(_ m: Messaging, didReceiveRegistrationToken token: String?) {
    guard let token else { return }
    AuthService.shared.updateFcmToken(token)
  }
}

// En el root SwiftUI View:
// .onReceive(NotificationCenter.default.publisher(for: .sessionRevoked)) { _ in
//     appState.navigateToLogin(reason: .sessionRevoked)
// }`}</Code>
          </Card>
        </div>
      )}
      {plat === 1 && (
        <div>
          <Card badge="Android — Setup" badgeColor="green">
            <ul style={{ margin: 0, paddingLeft: 16, color: "var(--color-text-secondary)", fontSize: 13, lineHeight: 2.1 }}>
              <li>Descargar <code style={{ color: "#1D9E75" }}>google-services.json</code> → colocar en <code style={{ color: "#1D9E75" }}>app/</code></li>
              <li><code style={{ color: "#1D9E75" }}>build.gradle (project)</code>: plugin <code style={{ color: "#1D9E75" }}>com.google.gms:google-services</code></li>
              <li><code style={{ color: "#1D9E75" }}>build.gradle (app)</code>: dependencia <code style={{ color: "#1D9E75" }}>firebase-messaging-ktx</code></li>
              <li>Data messages se reciben <strong style={{ color: "var(--color-text-primary)" }}>aunque la app esté muerta</strong></li>
            </ul>
          </Card>
          <Card badge="AppFirebaseMessagingService.kt" badgeColor="purple">
            <Code>{`class AppFirebaseMessagingService : FirebaseMessagingService() {

  // ⚡ Data messages — funciona con app cerrada o en background
  override fun onMessageReceived(message: RemoteMessage) {
    if (message.data["type"] != "SESSION_REVOKED") return

    SessionManager.clearSession(applicationContext)

    LocalBroadcastManager.getInstance(this)
      .sendBroadcast(Intent("SESSION_REVOKED"))
    // Si app está muerta → MainActivity lo detecta al abrirse
    // via SessionManager.isSessionValid()
  }

  override fun onNewToken(token: String) {
    SessionManager.saveFcmToken(applicationContext, token)
    AuthRepository.updateFcmToken(token)   // solo si hay sesión activa
  }
}

// En MainActivity:
val receiver = object : BroadcastReceiver() {
  override fun onReceive(ctx: Context, intent: Intent) {
    startActivity(
      Intent(ctx, LoginActivity::class.java).apply {
        flags = FLAG_ACTIVITY_NEW_TASK or FLAG_ACTIVITY_CLEAR_TASK
        putExtra("reason", "SESSION_REVOKED")
      }
    )
  }
}

override fun onResume() {
  super.onResume()
  if (!SessionManager.isSessionValid()) navigateToLogin()
  LocalBroadcastManager.getInstance(this)
    .registerReceiver(receiver, IntentFilter("SESSION_REVOKED"))
}
override fun onPause() {
  super.onPause()
  LocalBroadcastManager.getInstance(this).unregisterReceiver(receiver)
}`}</Code>
          </Card>
        </div>
      )}
    </div>
  );
}

function SecContrato() {
  return (
    <div>
      <SectionTitle tag="Responsabilidades" label="Contrato backend → clientes" />
      <Card accent="#1D9E75">
        <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: 13.5, lineHeight: 1.8 }}>
          Esta sección define qué <strong style={{ color: "var(--color-text-primary)" }}>entrega el backend</strong> y
          qué <strong style={{ color: "var(--color-text-primary)" }}>consume cada equipo</strong>. Es el acuerdo de interfaz entre los tres equipos.
        </p>
      </Card>
      <Row>
        <Card badge="Backend entrega" badgeColor="purple">
          <ul style={{ margin: 0, paddingLeft: 16, color: "var(--color-text-secondary)", fontSize: 13, lineHeight: 2.1 }}>
            <li>Endpoint WS: <code style={{ color: "#1D9E75" }}>wss://...?token=JWT</code></li>
            <li>Lambda <code style={{ color: "#1D9E75" }}>$connect</code> valida JWT</li>
            <li>Evento <code style={{ color: "#1D9E75" }}>SESSION_REVOKED</code> por WS (WEB)</li>
            <li>FCM data message silencioso (APP)</li>
            <li>Acepta <code style={{ color: "#1D9E75" }}>fcm_token</code> en el login</li>
            <li>Close code <code style={{ color: "#1D9E75" }}>1000</code> tras el evento WS</li>
          </ul>
        </Card>
        <Card badge="Clientes consumen" badgeColor="teal">
          <ul style={{ margin: 0, paddingLeft: 16, color: "var(--color-text-secondary)", fontSize: 13, lineHeight: 2.1 }}>
            <li><strong style={{ color: "var(--color-text-primary)" }}>WEB:</strong> abrir WS al login, hook + screen</li>
            <li><strong style={{ color: "var(--color-text-primary)" }}>APP:</strong> enviar <code style={{ color: "#1D9E75" }}>fcm_token</code> en el login</li>
            <li><strong style={{ color: "var(--color-text-primary)" }}>APP:</strong> implementar FCM service</li>
            <li><strong style={{ color: "var(--color-text-primary)" }}>Ambos:</strong> limpiar store al recibir evento</li>
            <li><strong style={{ color: "var(--color-text-primary)" }}>Ambos:</strong> mostrar <code style={{ color: "#1D9E75" }}>SessionRevokedScreen</code></li>
            <li><strong style={{ color: "var(--color-text-primary)" }}>WEB:</strong> reconexión con backoff</li>
          </ul>
        </Card>
      </Row>
      <Card badge="Evento WS" badgeColor="blue" title="backend → WEB">
        <Code>{`{ "type": "SESSION_REVOKED", "revokedAt": "2026-05-25T14:30:00Z" }`}</Code>
      </Card>
      <Card badge="FCM payload" badgeColor="green" title="backend → FCM → APP">
        <Code>{`{
  "token": "fcm_token_del_dispositivo_anterior",
  "data": {
    "type":      "SESSION_REVOKED",
    "revokedAt": "2026-05-25T14:30:00Z"
  },
  "apns": {
    "headers": { "apns-priority": "10" },
    "payload": { "aps": { "content-available": 1 } }  // silent push iOS
  },
  "android": { "priority": "high" }                   // app cerrada Android
}`}</Code>
      </Card>
      <Card badge="Matriz de responsabilidades" badgeColor="gray">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--color-border-tertiary)" }}>
              {["Tarea", "Backend", "WEB", "iOS", "Android"].map(h => (
                <th key={h} style={{
                  padding: "6px 8px", textAlign: "left",
                  color: "var(--color-text-tertiary)", fontWeight: 600, fontSize: 11
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["DynamoDB Streams trigger", "✅", "—", "—", "—"],
              ["Lambda dispatcher", "✅", "—", "—", "—"],
              ["API GW WebSocket endpoint", "✅", "—", "—", "—"],
              ["FCM integration (envío)", "✅", "—", "—", "—"],
              ["Agregar fcm_token al login", "—", "—", "✅", "✅"],
              ["FirebaseMessagingService", "—", "—", "✅", "✅"],
              ["onNewToken → actualizar backend", "—", "—", "✅", "✅"],
              ["Hook useSessionGuard", "—", "✅", "—", "—"],
              ["SessionRevokedScreen", "—", "✅", "✅", "✅"],
              ["Reconexión WS backoff", "—", "✅", "—", "—"],
            ].map(([task, ...rest], i) => (
              <tr key={i} style={{
                borderBottom: "1px solid var(--color-border-tertiary)",
                background: i % 2 ? "rgba(0,0,0,0.03)" : "transparent"
              }}>
                <td style={{ padding: "6px 8px", color: "var(--color-text-secondary)" }}>{task}</td>
                {rest.map((v, j) => (
                  <td key={j} style={{
                    padding: "6px 8px", textAlign: "center",
                    color: v === "✅" ? "#1D9E75" : "var(--color-text-tertiary)",
                    fontWeight: v === "✅" ? 700 : 400
                  }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default function Presentation() {
  const [active, setActive] = useState(0);
  const sections = [SecProblema, SecArquitectura, SecWeb, SecApp, SecContrato];
  const Section = sections[active];

  return (
    <div style={{
      fontFamily: "'DM Sans',system-ui,sans-serif",
      padding: "1.25rem 1rem", maxWidth: 820, margin: "0 auto",
    }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1D9E75" }} />
          <span style={{
            fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
            color: "var(--color-text-tertiary)", fontWeight: 600
          }}>
            Metro de Medellín · FIS · OAuth Platform
          </span>
        </div>
        <h1 style={{
          margin: 0, fontSize: 21, fontWeight: 700,
          color: "var(--color-text-primary)", lineHeight: 1.2
        }}>
          Notificación de sesiones revocadas en tiempo real
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--color-text-tertiary)" }}>
          Arquitectura de solución · {new Date().toLocaleDateString("es-CO",
            { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      <div style={{
        display: "flex", gap: 2, marginBottom: "1.5rem",
        borderBottom: "2px solid var(--color-border-tertiary)", overflowX: "auto"
      }}>
        {TABS.map((tab, i) => (
          <button key={tab.id} onClick={() => setActive(i)} style={{
            padding: "7px 14px", border: "none",
            borderBottom: active === i ? "2px solid #1D9E75" : "2px solid transparent",
            marginBottom: -2, background: "transparent",
            color: active === i ? "#1D9E75" : "var(--color-text-tertiary)",
            fontWeight: active === i ? 700 : 500,
            fontSize: 12.5, cursor: "pointer", whiteSpace: "nowrap",
          }}>{tab.label}</button>
        ))}
      </div>

      <Section />

      <div style={{
        display: "flex", justifyContent: "space-between", marginTop: "1.5rem",
        paddingTop: "1rem", borderTop: "1px solid var(--color-border-tertiary)"
      }}>
        <button onClick={() => setActive(a => Math.max(0, a - 1))} disabled={active === 0} style={{
          padding: "7px 18px", borderRadius: 8,
          border: "1px solid var(--color-border-tertiary)",
          background: "var(--color-background-secondary)",
          color: active === 0 ? "var(--color-text-tertiary)" : "var(--color-text-primary)",
          fontSize: 12.5, fontWeight: 600, cursor: active === 0 ? "default" : "pointer",
        }}>← Anterior</button>
        <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", alignSelf: "center" }}>
          {active + 1} / {TABS.length}
        </span>
        <button onClick={() => setActive(a => Math.min(TABS.length - 1, a + 1))}
          disabled={active === TABS.length - 1} style={{
            padding: "7px 18px", borderRadius: 8, border: "none",
            background: active === TABS.length - 1 ? "var(--color-border-secondary)" : "#1D9E75",
            color: "#fff", fontSize: 12.5, fontWeight: 600,
            cursor: active === TABS.length - 1 ? "default" : "pointer",
          }}>Siguiente →</button>
      </div>
    </div>
  );
}
