import { useEffect, useState, useRef, useMemo } from "react";
import { useUser } from "../../contexts/UserContext";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function Agenda() {
  const [isMobile, setIsMobile] = useState(false);
  const [agendamentos, setAgendamentos] = useState([]);
  const [view, setView] = useState("dayGridMonth");
  const [tituloCalendario, setTituloCalendario] = useState("");

  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
const [formEdit, setFormEdit] = useState(null);

  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [atendimentosDia, setAtendimentosDia] = useState([]);
  const { usuario } = useUser();

  const calendarRef = useRef(null);

  // 🔥 FIREBASE
useEffect(() => {
  if (!usuario?.empresaId) return;

  const q = query(
    collection(db, "agendamentos"),
    where("empresaId", "==", usuario.empresaId)
  );

  const unsub = onSnapshot(q, (snapshot) => {
    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setAgendamentos(lista);
  });

  return () => unsub();
}, [usuario]);

  // 🔥 MOBILE DETECT
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // 🔥 EVENTS
const events = useMemo(() => {
  return agendamentos.map((a) => ({
    id: a.id,
    title: `${a.titulo} - ${a.cliente}`,
    start: `${a.data}T${a.horaInicio}`,
    end: a.horaFim ? `${a.data}T${a.horaFim}` : undefined,

    extendedProps: {
      ...a,
      corProfissional: a.corProfissional || "#4A6FFF",
    },
  }));
}, [agendamentos]);

  // 🔥 NAV
  function next() {
    calendarRef.current?.getApi()?.next();
  }

  function prev() {
    calendarRef.current?.getApi()?.prev();
  }

  function today() {
    calendarRef.current?.getApi()?.today();
  }

  function changeView(v) {
    const calendarApi = calendarRef.current?.getApi();

    if (v === "timeGridWeek") {
      calendarApi.today();
      calendarApi.changeView("timeGridWeek");
    } else if (v === "timeGridDay") {
      calendarApi.today();
      calendarApi.changeView("timeGridDay");
    } else {
      calendarApi.changeView("dayGridMonth");
    }

    setView(v);
  }
function enviarConfirmacaoWhatsApp() {
  if (!eventoSelecionado.telefone) {
    alert("Telefone do cliente não cadastrado.");
    return;
  }

  const telefone = eventoSelecionado.telefone.replace(/\D/g, "");

  const mensagem = encodeURIComponent(
    `Olá ${eventoSelecionado.cliente}! 💙

Seu atendimento está confirmado.

📅 Data: ${formatarData(eventoSelecionado.data)}
⏰ Horário: ${eventoSelecionado.horaInicio}
💇 Serviço: ${eventoSelecionado.titulo}

Aguardamos você! 😊`
  );

  window.open(
    `https://wa.me/55${telefone}?text=${mensagem}`,
    "_blank"
  );
}

  async function atualizarStatus(id, status) {
    
    try {
      await updateDoc(doc(db, "agendamentos", id), { status });

      setEventoSelecionado((prev) => ({
        ...prev,
        status,
      }));
    } catch (error) {
      console.error(error);
    }
  }

async function excluirAgendamento() {
  try {
    await deleteDoc(doc(db, "agendamentos", eventoSelecionado.id));

    setEventoSelecionado(null);

    alert("Agendamento excluído!");
  } catch (error) {
    console.error(error);
  }
}
function temConflito(novo) {
  return agendamentos.some((a) => {
    if (a.data !== novo.data) return false;
    if (a.profissional !== novo.profissional) return false;

    const inicioA = a.horaInicio;
    const fimA = a.horaFim;

    const inicioB = novo.horaInicio;
    const fimB = novo.horaFim;

    return (
      (inicioB >= inicioA && inicioB < fimA) ||
      (fimB > inicioA && fimB <= fimA) ||
      (inicioB <= inicioA && fimB >= fimA)
    );
  });
}
  function formatarData(data) {
    if (!data) return "";

    return new Date(data + "T00:00:00").toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.nav}>
            <button style={styles.arrow} onClick={prev}>‹</button>
            <button style={styles.arrow} onClick={next}>›</button>
          </div>

          <div style={styles.monthTitle}>
            {view === "dayGridMonth" && "  "}
            {view === "timeGridWeek" && " "}
            {view === "timeGridDay" && " "}
            {tituloCalendario}
          </div>

          <div style={styles.tabs}>
            <button
              style={view === "dayGridMonth" ? styles.active : styles.tab}
              onClick={() => changeView("dayGridMonth")}
            >
              Mês
            </button>

            <button
              style={view === "timeGridWeek" ? styles.active : styles.tab}
              onClick={() => changeView("timeGridWeek")}
            >
              Semana
            </button>

            <button
              style={view === "timeGridDay" ? styles.active : styles.tab}
              onClick={() => changeView("timeGridDay")}
            >
              Dia
            </button>
          </div>
        </div>

        {/* CALENDÁRIO */}
        <div style={styles.calendar}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={isMobile ? "timeGridWeek" : "dayGridMonth"}

        
            slotMinTime="07:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={false}
            nowIndicator={true}
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            dayHeaderFormat={{ weekday: "short" }}
            expandRows={true}
            stickyHeaderDates={true}
            firstDay={0}
            weekends={true}
            height="100%"
contentHeight="100%"
handleWindowResize={true} ///////////////////////
            eventDisplay="auto"
            locale="pt-br"
            headerToolbar={false}
            events={events}
            dayMaxEventRows={6}
            viewDidMount={(info) => {
              setView(info.view.type);
              setTituloCalendario(info.view.title);
            }}
            datesSet={(info) => {
              const meses = [
                "Janeiro","Fevevereiro","Março","Abril","Maio","Junho",
                "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
              ];

              if (info.view.type === "dayGridMonth") {
                const dataAtual = info.view.currentStart;
                setTituloCalendario(meses[dataAtual.getMonth()]);
              }

              if (info.view.type === "timeGridWeek") {
                const inicio = new Date(info.start);
                const fim = new Date(info.end);
                fim.setDate(fim.getDate() - 1);

                setTituloCalendario(
                  `${inicio.getDate()} - ${fim.getDate()} ${meses[fim.getMonth()]}`
                );
              }

              if (info.view.type === "timeGridDay") {
                const data = new Date(info.start);
                setTituloCalendario(`${data.getDate()} ${meses[data.getMonth()]}`);
              }
            }}
            dateClick={(info) => {
              const lista = agendamentos.filter(
                (a) => a.data === info.dateStr
              );

              setDiaSelecionado(info.dateStr);
              setAtendimentosDia(lista);
            }}
        eventClick={(info) => {
  const data = {
    id: info.event.id,
    ...info.event.extendedProps,
  };

  setEventoSelecionado(data);
  setFormEdit(data); // 👈 importante
  setModoEdicao(false);

}}
eventContent={(arg) => {
    const cor =
    arg.event.extendedProps?.corProfissional ||
    "#4A6FFF";

  return (
    <div style={styles.eventContent}>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: cor,
          flexShrink: 0,
        }}
      />

      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {arg.event.title}
      </span>
    </div>
  );
}}
          />
        </div>
      </div>

      {/* MODAL EVENTO */}
      {eventoSelecionado && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button
              style={styles.closeIcon}
              onClick={() => setEventoSelecionado(null)}
            >
              ✕
            </button>

            <div
  style={{
    background: eventoSelecionado.corProfissional || "#4A6FFF",
    color: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
  }}
>
  <h2 style={{ margin: 0 }}>
    💇 {eventoSelecionado.titulo}
  </h2>

  <div style={{ opacity: .9, marginTop: 6 }}>
    {eventoSelecionado.profissional}
  </div>
</div>

{modoEdicao && (
  <div style={styles.editBox}>
    <h3>Editar agendamento</h3>

    <input
      style={styles.input}
      value={formEdit?.titulo || ""}
      onChange={(e) =>
        setFormEdit({ ...formEdit, titulo: e.target.value })
      }
      placeholder="Serviço"
    />

    <input
      style={styles.input}
      value={formEdit?.cliente || ""}
      onChange={(e) =>
        setFormEdit({ ...formEdit, cliente: e.target.value })
      }
      placeholder="Cliente"
    />

    {/* 👇 NOVO: DATA */}
    <input
      type="date"
      style={styles.input}
      value={formEdit?.data || ""}
      onChange={(e) =>
        setFormEdit({ ...formEdit, data: e.target.value })
      }
    />

    {/* 👇 NOVO: HORÁRIO */}
    <div style={{ display: "flex", gap: 8 }}>
      <input
        type="time"
        style={styles.input}
        value={formEdit?.horaInicio || ""}
        onChange={(e) =>
          setFormEdit({ ...formEdit, horaInicio: e.target.value })
        }
      />

      <input
        type="time"
        style={styles.input}
        value={formEdit?.horaFim || ""}
        onChange={(e) =>
          setFormEdit({ ...formEdit, horaFim: e.target.value })
        }
      />
    </div>

    {/* 👇 NOVO: PROFISSIONAL */}
    <input
      style={styles.input}
      value={formEdit?.profissional || ""}
      onChange={(e) =>
        setFormEdit({ ...formEdit, profissional: e.target.value })
      }
      placeholder="Profissional"
    />

    <input
      style={styles.input}
      value={formEdit?.valor || ""}
      onChange={(e) =>
        setFormEdit({ ...formEdit, valor: e.target.value })
      }
      placeholder="Valor"
    />

    <div style={styles.editActions}>
      <button
        style={styles.saveBtn}
          onClick={async () => {
  const conflito = agendamentos.some((a) => {
    if (a.id === formEdit.id) return false;
    if (a.data !== formEdit.data) return false;
    if (a.profissional !== formEdit.profissional) return false;

    return (
      (formEdit.horaInicio >= a.horaInicio &&
        formEdit.horaInicio < a.horaFim) ||
      (formEdit.horaFim > a.horaInicio &&
        formEdit.horaFim <= a.horaFim)
    );
  });

  if (conflito) {
    alert("⛔ Conflito de horário!");
    return;
  }

  await updateDoc(doc(db, "agendamentos", formEdit.id), {
    titulo: formEdit.titulo,
    cliente: formEdit.cliente,
    data: formEdit.data,
    horaInicio: formEdit.horaInicio,
    horaFim: formEdit.horaFim,
    profissional: formEdit.profissional,
    valor: Number(formEdit.valor || 0),
  });

  setEventoSelecionado(formEdit);
  setModoEdicao(false);
}}
      >
        Salvar
      </button>

      <button
        style={styles.cancelBtn}
        onClick={() => setModoEdicao(false)}
      >
        Cancelar
      </button>
    </div>
  </div>
)}


<div style={styles.infoCard}>
  <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-clock-icon lucide-calendar-clock"><path d="M16 14v2.2l1.6 1"/><path d="M16 2v4"/><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M3 10h5"/><path d="M8 2v4"/><circle cx="16" cy="16" r="6"/></svg> Data</span>
  <strong>
    {formatarData(eventoSelecionado.data)}
  </strong>
</div>


<div style={styles.infoCard}>
  <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alarm-clock-icon lucide-alarm-clock"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/></svg> Horário</span>
  <strong>
    {eventoSelecionado.horaInicio}
    {" - "}
    {eventoSelecionado.horaFim}
  </strong>
</div>


<div style={styles.infoCard}>
  <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Cliente</span>
  <strong>
    {eventoSelecionado.cliente}
  </strong>
</div>


<div style={styles.valorCard}>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-banknote-arrow-up-icon lucide-banknote-arrow-up"><path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5"/><path d="M18 12h.01"/><path d="M19 22v-6"/><path d="m22 19-3-3-3 3"/><path d="M6 12h.01"/><circle cx="12" cy="12" r="2"/></svg> R$ {Number(eventoSelecionado.valor || 0).toFixed(2)}
</div>
            <button
  style={styles.whatsappButton}
  onClick={enviarConfirmacaoWhatsApp}
>
  Confirmar pelo WhatsApp
</button>
<button
  style={{ ...styles.actionButton, background: "#4A6FFF", color: "#fff" }}
  onClick={() => setModoEdicao(true)}
>
  Editar
</button>

            <h4>Status</h4>

            <div style={styles.statusContainer}>
              <button
                onClick={() =>
                  atualizarStatus(eventoSelecionado.id, "concluido")
                }
                style={{
                  ...styles.statusButton,
                  background:
                    eventoSelecionado.status === "concluido"
                      ? "#16A34A"
                      : "#f2f6f3ff",
                  color:
                    eventoSelecionado.status === "concluido"
                      ? "#FFF"
                      : "#111",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#61c278ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
              </button>

<button
  style={{
    ...styles.actionButton,
    background: "#EF4444",
    color: "#fff",
  }}
  onClick={excluirAgendamento}
>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f2f2f2ff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DIA */}
      {diaSelecionado && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button
              style={styles.closeIcon}
              onClick={() => setDiaSelecionado(null)}
            >
              ✕
            </button>

            <h2>Atendimentos</h2>
            <p>{formatarData(diaSelecionado)}</p>

            {atendimentosDia.length === 0 && (
              <p>Nenhum atendimento.</p>
            )}

            {atendimentosDia.map((item) => (
              <div key={item.id} style={styles.cardAtendimento}>
                <strong>
                  {item.horaInicio} - {item.horaFim}
                </strong>

                <div>{item.cliente}</div>
                <div>{item.titulo}</div>

                <div
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color:
                      item.status === "cancelado"
                        ? "#DC2626"
                        : item.status === "concluido"
                        ? "#16A34A"
                        : "#F59E0B",
                  }}
                >
                  {item.status === "cancelado"
                    ? "❌ Cancelado"
                    : item.status === "concluido"
                    ? "✅ Concluído"
                    : "⏳ Pendente"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
container: {
  display: "flex",
  flexDirection: "column",
  width: "100%",
    maxWidth: "100%",
  height: "100dvh",
  padding: 12,
  background: "#F5F7FB",
  boxSizing: "border-box",

},

  header: {
    background: "#fff",
    padding: 8,
    borderRadius: 16,
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
      flexWrap: "wrap",
    gap: 10,
    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
  },

  nav: { display: "flex", gap: 10 },
  arrow: {
    border: "none",
    background: "#f3f3f7ff",
    padding: "8px 12px",
    borderRadius: 10,
    fontSize: 18,
    cursor: "pointer",
  },

  tabs: { display: "flex", gap: 6 },
  tab: {
    border: "none",
    padding: "6px 8px",
    borderRadius: 8,
    background: "#EEF2FF",
    fontWeight: 600,
    fontSize: 12,
  },

  active: {
    border: "none",
    padding: "6px 8px",
    borderRadius: 8,
    background: "#4A6FFF",
    color: "#fff",
    fontWeight: 600,
    fontSize: 12,
  },

calendar: {
  flex: 1,
  background: "#fff",
  borderRadius: 16,
  padding: 8,
  overflow: "hidden",
  minHeight: 0,
},

  monthTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: 600,
    background: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(4px)",

  },
  overlay: {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
},

  modal: {
    position: "relative",
    width: "100%",
    maxWidth: 450,
    height: "70vh",
    maxHeight: "70vh",
    background: "#fff",
    borderRadius: 20,
    overflowY: "auto",
    padding: 25,
  },

  closeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 35,
    height: 35,
    border: "none",
    borderRadius: "50%",
    background: "#F3F4F6",
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
  },

  statusContainer: { display: "flex", gap: 10, marginTop: 10 },
  statusButton: {
    flex: 1,
    border: "none",
    marginBottom: 5,
    padding: 10,
    borderRadius: 12,
    fontWeight: 600,
  },
  
  actionButton: {
    flex: 1,
    border: "none",
    display: "flex",
    justifyContent: "center",
    margin:5,
    padding: 10,
    borderRadius: 12,
    cursor: "pointer",
  },

  cardAtendimento: {
    padding: 12,
    borderRadius: 12,
    background: "#F7F8FC",
    marginBottom: 10,
  },

eventContent: {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "0px 4px",
  borderRadius: 4,
  overflow: "hidden",

},
 eventText: {
  fontSize: 12,
  fontWeight: 600,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
},
whatsappButton: {
  width: "100%",
  border: "none",
  background: "#25D366",
  color: "#fff",
  padding: 12,
  borderRadius: 12,
  fontWeight: 600,
  cursor: "pointer",
  marginTop: 10,
},
infoCard: {
  background: "#F8FAFC",
  border: "1px solid #E5E7EB",
  borderRadius: 14,
  padding: 14,
  marginBottom: 10,

  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  fontSize: 14,
},


valorCard: {
  marginTop: 12,
  padding: 16,

  background: "#ECFDF5",
  color: "#059669",

  borderRadius: 14,

  fontWeight: 700,
  fontSize: 20,
  textAlign: "center",
},


editBox: {
  background: "#F8FAFC",
  border: "1px solid #E5E7EB",
  borderRadius: 14,
  padding: 20,
  marginBottom: 12,
  display: "flex",
  flexDirection: "column",
  gap: 10,

  width: "100%",
  boxSizing: "border-box",

},

input: {
  padding: 10,
  borderRadius: 10,
  border: "1px solid #D1D5DB",
  outline: "none",
  fontSize: 14,
},

editActions: {
  display: "flex",
  gap: 10,
  marginTop: 10,
},

saveBtn: {
  flex: 1,
  background: "#4A6FFF",
  color: "#fff",
  border: "none",
  padding: 10,
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer",
},

cancelBtn: {
  flex: 1,
  background: "#E5E7EB",
  color: "#111",
  
  border: "none",
  padding: 10,
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer",
},

};

export default Agenda;