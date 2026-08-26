import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../services/firebase.js";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

function PaginaPublica() {
  const { uid } = useParams();

  // ============================================================
  // DADOS DO PROFISSIONAL / DONO DA PÁGINA
  // ============================================================

  const [dadosProfissional, setDadosProfissional] = useState(null);

  // ============================================================
  // EQUIPE
  // ============================================================

  const [membrosEquipe, setMembrosEquipe] = useState([]);
  const [profissionalSelecionado, setProfissionalSelecionado] =
    useState(null);
  const [carregandoEquipe, setCarregandoEquipe] = useState(false);

  // ============================================================
  // DADOS DO CLIENTE
  // ============================================================

  const [nomeCliente, setNomeCliente] = useState("");
  const [telefoneCliente, setTelefoneCliente] = useState("");

  // ============================================================
  // ESTADOS DA PÁGINA
  // ============================================================

  const [pagina, setPagina] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const [paginaNaoEncontrada, setPaginaNaoEncontrada] =
    useState(false);

  const [erroCarregamento, setErroCarregamento] =
    useState(false);

  const [carregandoHorarios, setCarregandoHorarios] =
    useState(false);

  const [salvandoAgendamento, setSalvandoAgendamento] =
    useState(false);

  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const [servicoSelecionado, setServicoSelecionado] =
    useState(null);

  const [dataSelecionada, setDataSelecionada] =
    useState(null);

  const [horarioSelecionado, setHorarioSelecionado] =
    useState(null);

  const [horariosOcupados, setHorariosOcupados] =
    useState([]);

  // ============================================================
  // CARREGAR PÁGINA
  // ============================================================

  useEffect(() => {
    let ativo = true;

    const carregarPagina = async () => {
      setCarregando(true);
      setPaginaNaoEncontrada(false);
      setErroCarregamento(false);

      if (!uid) {
        console.error("Nenhum UID foi encontrado na URL.");

        if (ativo) {
          setPagina(null);
          setPaginaNaoEncontrada(true);
          setCarregando(false);
        }

        return;
      }

      try {
        const uidLimpo = String(uid).trim();

        console.log(
          "========================================"
        );
        console.log("CARREGANDO PÁGINA PÚBLICA");
        console.log("UID recebido pela URL:", uidLimpo);
        console.log(
          "========================================"
        );

        // --------------------------------------------------------
        // BUSCAR USUÁRIO
        // --------------------------------------------------------

        const usuarioRef = doc(
          db,
          "usuarios",
          uidLimpo
        );

        const usuarioSnap = await getDoc(usuarioRef);

        console.log(
          "Documento usuarios existe?",
          usuarioSnap.exists()
        );

        if (!usuarioSnap.exists()) {
          console.error(
            "Usuário não encontrado no Firestore.",
            {
              uid: uidLimpo,
            }
          );

          if (ativo) {
            setDadosProfissional(null);
            setPagina(null);
            setPaginaNaoEncontrada(true);
          }

          return;
        }

        // --------------------------------------------------------
        // DADOS DO USUÁRIO
        // --------------------------------------------------------

        const dados = usuarioSnap.data();

        console.log(
          "Dados do usuário encontrados:",
          dados
        );

        console.log(
          "paginaAgendamento:",
          dados?.paginaAgendamento
        );

        // --------------------------------------------------------
        // VERIFICAR SE A PÁGINA EXISTE
        // --------------------------------------------------------

        if (
          !dados?.paginaAgendamento ||
          typeof dados.paginaAgendamento !== "object"
        ) {
          console.error(
            "Usuário encontrado, mas não possui página de agendamento configurada."
          );

          if (ativo) {
            setDadosProfissional(dados);
            setPagina(null);
            setPaginaNaoEncontrada(true);
          }

          return;
        }

        // --------------------------------------------------------
        // PÁGINA ENCONTRADA
        // --------------------------------------------------------

        if (ativo) {
          setDadosProfissional(dados);
          setPagina(dados.paginaAgendamento);
          setPaginaNaoEncontrada(false);
          setErroCarregamento(false);
        }

        console.log(
          "Página pública carregada com sucesso."
        );
      } catch (error) {
        console.error(
          "Erro ao carregar página pública:",
          error
        );

        if (ativo) {
          setPagina(null);
          setErroCarregamento(true);
          setPaginaNaoEncontrada(false);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    };

    carregarPagina();

    return () => {
      ativo = false;
    };
  }, [uid]);

  // ============================================================
  // CARREGAR EQUIPE
  // ============================================================

  useEffect(() => {
    const carregarEquipe = async () => {
      if (!dadosProfissional?.empresaId) {
        setMembrosEquipe([]);
        return;
      }

      setCarregandoEquipe(true);

      try {
        const equipeRef = collection(db, "equipe");

        const q = query(
          equipeRef,
          where(
            "empresaId",
            "==",
            dadosProfissional.empresaId
          ),
          where("status", "==", "ativo")
        );

        const snapshot = await getDocs(q);

        const lista = snapshot.docs.map(
          (docSnapshot) => ({
            id: docSnapshot.id,
            ...docSnapshot.data(),
          })
        );

        setMembrosEquipe(lista);

        console.log(
          "Profissionais encontrados na equipe:",
          lista
        );
      } catch (error) {
        console.error(
          "Erro ao carregar profissionais da equipe:",
          error
        );

        setMembrosEquipe([]);
      } finally {
        setCarregandoEquipe(false);
      }
    };

    carregarEquipe();
  }, [dadosProfissional]);

  // ============================================================
  // HORÁRIOS
  // ============================================================

  const horarios = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
  ];

  // ============================================================
  // DATAS
  // ============================================================

  const gerarDatas = () => {
    const datas = [];
    const hoje = new Date();

    for (let i = 0; i < 7; i++) {
      const data = new Date(hoje);

      data.setDate(
        hoje.getDate() + i
      );

      datas.push(data);
    }

    return datas;
  };

  const datas = gerarDatas();

  // ============================================================
  // FORMATAÇÕES
  // ============================================================

  const formatarData = (data) => {
    const ano = data.getFullYear();

    const mes = String(
      data.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
      data.getDate()
    ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  };

  const formatarDiaSemana = (data) => {
    return new Intl.DateTimeFormat(
      "pt-BR",
      {
        weekday: "short",
      }
    )
      .format(data)
      .replace(".", "")
      .slice(0, 3)
      .toUpperCase();
  };

  const formatarValor = (valor) => {
    if (
      valor === "" ||
      valor === null ||
      valor === undefined
    ) {
      return "R$ 0,00";
    }

    return `R$ ${Number(valor)
      .toFixed(2)
      .replace(".", ",")}`;
  };

  // ============================================================
  // FORMATAR TELEFONE
  // ============================================================

  const formatarTelefone = (valor) => {
    const numeros = valor.replace(/\D/g, "");

    if (numeros.length <= 10) {
      return numeros
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return numeros
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  // ============================================================
  // SERVIÇO ATUAL
  // ============================================================

  const servicoAtual =
    pagina?.servicos?.find(
      (servico) =>
        servico.id === servicoSelecionado
    );

  // ============================================================
  // CONVERTER HORÁRIO PARA MINUTOS
  // ============================================================

  const horarioParaMinutos = (horario) => {
    const [hora, minuto] =
      horario.split(":").map(Number);

    return hora * 60 + minuto;
  };

  // ============================================================
  // CONVERTER MINUTOS PARA HORÁRIO
  // ============================================================

  const minutosParaHorario = (minutos) => {
    const horas = Math.floor(
      minutos / 60
    );

    const minutosRestantes =
      minutos % 60;

    return `${String(horas).padStart(
      2,
      "0"
    )}:${String(minutosRestantes).padStart(
      2,
      "0"
    )}`;
  };

  // ============================================================
  // BUSCAR HORÁRIOS OCUPADOS
  // ============================================================

  const carregarHorariosOcupados = async (
    data
  ) => {
    if (
      !data ||
      !profissionalSelecionado
    ) {
      setHorariosOcupados([]);
      return;
    }

    setCarregandoHorarios(true);
    setHorariosOcupados([]);

    try {
      const agendamentosRef =
        collection(
          db,
          "agendamentos"
        );

      const q = query(
        agendamentosRef,
        where(
          "profissionalId",
          "==",
          profissionalSelecionado.id
        ),
        where(
          "data",
          "==",
          data
        )
      );

      const snapshot =
        await getDocs(q);

      const ocupados = [];

      snapshot.forEach(
        (docSnapshot) => {
          const agendamento =
            docSnapshot.data();

          if (
            agendamento.status ===
            "cancelado"
          ) {
            return;
          }

          if (!agendamento.horario) {
            return;
          }

          const horarioInicial =
            horarioParaMinutos(
              agendamento.horario
            );

          const duracao = Number(
            agendamento.servico
              ?.duracao ||
              agendamento.duracao ||
              30
          );

          const horarioFinal =
            horarioInicial + duracao;

          for (
            let minuto = horarioInicial;
            minuto < horarioFinal;
            minuto += 30
          ) {
            ocupados.push(
              minutosParaHorario(
                minuto
              )
            );
          }
        }
      );

      setHorariosOcupados(
        [...new Set(ocupados)]
      );
    } catch (error) {
      console.error(
        "Erro ao carregar horários ocupados:",
        error
      );

      setHorariosOcupados([]);
    } finally {
      setCarregandoHorarios(false);
    }
  };

  // ============================================================
  // SELECIONAR SERVIÇO
  // ============================================================

  const selecionarServico = (id) => {
    setServicoSelecionado(id);
    setDataSelecionada(null);
    setHorarioSelecionado(null);
    setHorariosOcupados([]);
    setMensagemErro("");
    setMensagemSucesso("");
  };

  // ============================================================
  // SELECIONAR PROFISSIONAL
  // ============================================================

  const selecionarProfissional = (
    profissional
  ) => {
    setProfissionalSelecionado(
      profissional
    );

    setDataSelecionada(null);
    setHorarioSelecionado(null);
    setHorariosOcupados([]);
    setMensagemErro("");
    setMensagemSucesso("");
  };

  // ============================================================
  // SELECIONAR DATA
  // ============================================================

  const selecionarData = async (data) => {
    if (!profissionalSelecionado) {
      setMensagemErro(
        "Selecione um profissional primeiro."
      );

      return;
    }

    setDataSelecionada(data);
    setHorarioSelecionado(null);
    setMensagemErro("");
    setMensagemSucesso("");

    await carregarHorariosOcupados(
      data
    );
  };

  // ============================================================
  // SELECIONAR HORÁRIO
  // ============================================================

  const selecionarHorario = (
    horario
  ) => {
    if (
      horariosOcupados.includes(
        horario
      )
    ) {
      return;
    }

    setHorarioSelecionado(
      horario
    );

    setMensagemErro("");
    setMensagemSucesso("");
  };

  // ============================================================
  // ALTERAR NOME
  // ============================================================

  const alterarNomeCliente = (
    event
  ) => {
    setNomeCliente(
      event.target.value
    );

    setMensagemErro("");
    setMensagemSucesso("");
  };

  // ============================================================
  // ALTERAR TELEFONE
  // ============================================================

  const alterarTelefoneCliente = (
    event
  ) => {
    const telefoneFormatado =
      formatarTelefone(
        event.target.value
      );

    setTelefoneCliente(
      telefoneFormatado
    );

    setMensagemErro("");
    setMensagemSucesso("");
  };

  // ============================================================
  // CONFIRMAR AGENDAMENTO
  // ============================================================

  const confirmarAgendamento =
    async () => {
      if (!profissionalSelecionado) {
        setMensagemErro(
          "Selecione o profissional que realizará o atendimento."
        );

        return;
      }

      if (
        !servicoSelecionado ||
        !dataSelecionada ||
        !horarioSelecionado ||
        !servicoAtual ||
        !uid
      ) {
        setMensagemErro(
          "Selecione o serviço, a data e o horário."
        );

        return;
      }

      const nomeLimpo =
        nomeCliente.trim();

      if (!nomeLimpo) {
        setMensagemErro(
          "Digite seu nome para continuar."
        );

        return;
      }

      if (nomeLimpo.length < 2) {
        setMensagemErro(
          "Digite um nome válido."
        );

        return;
      }

      const telefoneLimpo =
        telefoneCliente.replace(
          /\D/g,
          ""
        );

      if (!telefoneLimpo) {
        setMensagemErro(
          "Digite seu telefone para continuar."
        );

        return;
      }

      if (
        telefoneLimpo.length < 10 ||
        telefoneLimpo.length > 11
      ) {
        setMensagemErro(
          "Digite um telefone válido com DDD."
        );

        return;
      }

      setSalvandoAgendamento(true);
      setMensagemErro("");
      setMensagemSucesso("");

      try {
        const duracao = Number(
          servicoAtual.duracao || 30
        );

        const inicio =
          horarioParaMinutos(
            horarioSelecionado
          );

        const horariosDoAgendamento =
          [];

        for (
          let minuto = inicio;
          minuto <
          inicio + duracao;
          minuto += 30
        ) {
          horariosDoAgendamento.push(
            minutosParaHorario(
              minuto
            )
          );
        }

        const profissionalId =
          profissionalSelecionado.id;

        const profissionalNome =
          profissionalSelecionado.nome ||
          "Profissional";

        const agendamentoId =
          `${profissionalId}_${dataSelecionada}_${horarioSelecionado}`
            .replace(
              /[:\s]/g,
              "-"
            );

        const agendamentoRef =
          doc(
            db,
            "agendamentos",
            agendamentoId
          );

        await runTransaction(
          db,
          async (transaction) => {
            const documentosParaVerificar =
              [];

            for (
              const horario of
              horariosDoAgendamento
            ) {
              const idHorario =
                `${profissionalId}_${dataSelecionada}_${horario}`
                  .replace(
                    /[:\s]/g,
                    "-"
                  );

              const ref = doc(
                db,
                "agendamentos",
                idHorario
              );

              documentosParaVerificar.push(
                ref
              );
            }

            const snapshots =
              await Promise.all(
                documentosParaVerificar.map(
                  (ref) =>
                    transaction.get(
                      ref
                    )
                )
              );

            const algumOcupado =
              snapshots.some(
                (snapshot) =>
                  snapshot.exists() &&
                  snapshot.data()
                    ?.status !==
                    "cancelado"
              );

            if (algumOcupado) {
              throw new Error(
                "HORARIO_OCUPADO"
              );
            }

            transaction.set(
              agendamentoRef,
              {
                profissionalId,

                empresaId:
                  dadosProfissional?.empresaId ||
                  null,

                gestorId: uid,

                profissional:
                  profissionalNome,

                profissionalNome:
                  profissionalNome,

                profissionalCargo:
                  profissionalSelecionado
                    .cargo || "",

                profissionalCor:
                  profissionalSelecionado
                    .cor ||
                  "#4A6FFF",

                clienteId: null,

                clienteNome:
                  nomeLimpo,

                clienteTelefone:
                  telefoneCliente.trim(),

                cliente: nomeLimpo,

                telefone:
                  telefoneCliente.trim(),

                servico: {
                  id:
                    servicoAtual.id ||
                    null,

                  nome:
                    servicoAtual.nome ||
                    "Serviço",

                  valor: Number(
                    servicoAtual.valor ||
                      0
                  ),

                  duracao,
                },

                servicoId:
                  servicoAtual.id ||
                  null,

                servicoNome:
                  servicoAtual.nome ||
                  "Serviço",

                titulo:
                  servicoAtual.nome ||
                  "Serviço",

                valor: Number(
                  servicoAtual.valor ||
                    0
                ),

                duracao,

                data:
                  dataSelecionada,

                horario:
                  horarioSelecionado,

                horaInicio:
                  horarioSelecionado,

                horaFim:
                  minutosParaHorario(
                    inicio + duracao
                  ),

                horarios:
                  horariosDoAgendamento,

                status:
                  "confirmado",

                origem:
                  "pagina_publica",

                criadoEm:
                  serverTimestamp(),

                atualizadoEm:
                  serverTimestamp(),
              }
            );
          }
        );

        setHorariosOcupados(
          (anteriores) => [
            ...new Set([
              ...anteriores,
              ...horariosDoAgendamento,
            ]),
          ]
        );

        setHorarioSelecionado(
          null
        );

        setNomeCliente("");
        setTelefoneCliente("");

        setMensagemSucesso(
          `Agendamento confirmado com ${profissionalNome}! ${servicoAtual.nome} em ${dataSelecionada} às ${horarioSelecionado}.`
        );
      } catch (error) {
        console.error(
          "Erro ao criar agendamento:",
          error
        );

        if (
          error.message ===
          "HORARIO_OCUPADO"
        ) {
          setMensagemErro(
            "Esse horário acabou de ser reservado por outra pessoa. Escolha outro horário."
          );

          await carregarHorariosOcupados(
            dataSelecionada
          );
        } else {
          setMensagemErro(
            "Não foi possível realizar o agendamento. Tente novamente."
          );
        }
      } finally {
        setSalvandoAgendamento(
          false
        );
      }
    };

  // ============================================================
  // VERIFICAR SE PODE AGENDAR
  // ============================================================

  const podeAgendar =
    profissionalSelecionado &&
    servicoSelecionado &&
    dataSelecionada &&
    horarioSelecionado &&
    nomeCliente.trim().length >= 2 &&
    telefoneCliente.replace(
      /\D/g,
      ""
    ).length >= 10 &&
    !salvandoAgendamento;

  // ============================================================
  // CARREGANDO
  // ============================================================

  if (carregando) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}>
            ⏳
          </div>

          <p style={styles.loadingText}>
            Carregando página...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERRO DE CARREGAMENTO
  // ============================================================

  if (erroCarregamento) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.errorIcon}>
            !
          </div>

          <h1 style={styles.notFoundTitle}>
            Não foi possível carregar
          </h1>

          <p style={styles.notFoundText}>
            Ocorreu um erro ao carregar esta
            página de agendamento. Verifique
            sua conexão e tente novamente.
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            style={styles.retryButton}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // PÁGINA NÃO ENCONTRADA
  // ============================================================

  if (
    paginaNaoEncontrada ||
    !pagina
  ) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <div style={styles.notFoundIcon}>
            !
          </div>

          <h1 style={styles.notFoundTitle}>
            Página não encontrada
          </h1>

          <p style={styles.notFoundText}>
            Esta página de agendamento
            não existe ou ainda não foi
            configurada.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      style={{
        ...styles.page,
        backgroundColor: "#f5f7fb",
      }}
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header
        style={{
          ...styles.header,
          backgroundColor:
            pagina.cor || "#4A6FFF",
        }}
      >
        <div style={styles.logo}>
          {pagina.logo ? (
            <img
              src={pagina.logo}
              alt={
                pagina.nome || "Logo"
              }
              style={styles.logoImage}
            />
          ) : (
            <span>
              {pagina.nome
                ? pagina.nome
                    .charAt(0)
                    .toUpperCase()
                : "A"}
            </span>
          )}
        </div>

        <h1 style={styles.name}>
          {pagina.nome ||
            "Página de agendamento"}
        </h1>

        <p style={styles.description}>
          {pagina.descricao ||
            "Agende seu horário de forma rápida e fácil."}
        </p>
      </header>

      {/* ======================================================
          CONTEÚDO
      ====================================================== */}

      <main style={styles.content}>
        {/* ====================================================
            SERVIÇOS
        ==================================================== */}

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Escolha um serviço
          </h2>

          {!pagina.servicos ||
          pagina.servicos.length === 0 ? (
            <div style={styles.empty}>
              <div
                style={{
                  ...styles.emptyIcon,
                  backgroundColor: `${
                    pagina.cor ||
                    "#4A6FFF"
                  }18`,
                  color:
                    pagina.cor ||
                    "#4A6FFF",
                }}
              >
                ✦
              </div>

              <p
                style={
                  styles.emptyTitle
                }
              >
                Nenhum serviço disponível
              </p>

              <span
                style={styles.emptyText}
              >
                Este profissional ainda não
                cadastrou nenhum serviço.
              </span>
            </div>
          ) : (
            <div style={styles.services}>
              {pagina.servicos.map(
                (servico) => {
                  const selecionado =
                    servicoSelecionado ===
                    servico.id;

                  return (
                    <button
                      key={servico.id}
                      type="button"
                      onClick={() =>
                        selecionarServico(
                          servico.id
                        )
                      }
                      style={{
                        ...styles.service,
                        borderColor:
                          selecionado
                            ? pagina.cor
                            : "#e5e7eb",
                        backgroundColor:
                          selecionado
                            ? `${
                                pagina.cor ||
                                "#4A6FFF"
                              }08`
                            : "#ffffff",
                        boxShadow:
                          selecionado
                            ? `0 0 0 2px ${
                                pagina.cor ||
                                "#4A6FFF"
                              }20`
                            : "none",
                      }}
                    >
                      <div
                        style={
                          styles.serviceLeft
                        }
                      >
                        <div
                          style={{
                            ...styles.serviceIcon,
                            backgroundColor:
                              selecionado
                                ? pagina.cor
                                : `${
                                    pagina.cor ||
                                    "#4A6FFF"
                                  }18`,
                            color:
                              selecionado
                                ? "#ffffff"
                                : pagina.cor,
                          }}
                        >
                          {selecionado
                            ? "✓"
                            : "✦"}
                        </div>

                        <div
                          style={
                            styles.serviceInfo
                          }
                        >
                          <strong
                            style={
                              styles.serviceName
                            }
                          >
                            {servico.nome ||
                              "Serviço"}
                          </strong>

                          <span
                            style={
                              styles.serviceDuration
                            }
                          >
                            {servico.duracao ||
                              30}{" "}
                            minutos
                          </span>
                        </div>
                      </div>

                      <strong
                        style={
                          styles.price
                        }
                      >
                        {formatarValor(
                          servico.valor
                        )}
                      </strong>
                    </button>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* ====================================================
            PROFISSIONAIS
        ==================================================== */}

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Escolha o profissional
          </h2>

          <p
            style={
              styles.professionalDescription
            }
          >
            Selecione quem realizará seu
            atendimento.
          </p>

          {carregandoEquipe ? (
            <div style={styles.empty}>
              <div
                style={
                  styles.emptyEmoji
                }
              >
                ⏳
              </div>

              <p
                style={
                  styles.emptyTitle
                }
              >
                Carregando profissionais...
              </p>

              <span
                style={styles.emptyText}
              >
                Estamos buscando os
                profissionais disponíveis.
              </span>
            </div>
          ) : membrosEquipe.length ===
            0 ? (
            <div style={styles.empty}>
              <div
                style={
                  styles.emptyEmoji
                }
              >
                👤
              </div>

              <p
                style={
                  styles.emptyTitle
                }
              >
                Nenhum profissional disponível
              </p>

              <span
                style={styles.emptyText}
              >
                Ainda não existem profissionais
                cadastrados na equipe.
              </span>
            </div>
          ) : (
            <div
              style={
                styles.professionalGrid
              }
            >
              {membrosEquipe.map(
                (profissional) => {
                  const selecionado =
                    profissionalSelecionado?.id ===
                    profissional.id;

                  return (
                    <button
                      key={profissional.id}
                      type="button"
                      onClick={() =>
                        selecionarProfissional(
                          profissional
                        )
                      }
                      style={{
                        ...styles.professional,
                        borderColor:
                          selecionado
                            ? pagina.cor ||
                              "#4A6FFF"
                            : "#e5e7eb",
                        backgroundColor:
                          selecionado
                            ? `${
                                pagina.cor ||
                                "#4A6FFF"
                              }08`
                            : "#ffffff",
                        boxShadow:
                          selecionado
                            ? `0 0 0 2px ${
                                pagina.cor ||
                                "#4A6FFF"
                              }20`
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          ...styles.professionalAvatar,
                          backgroundColor:
                            profissional.cor ||
                            pagina.cor ||
                            "#4A6FFF",
                        }}
                      >
                        {profissional.nome
                          ?.charAt(0)
                          .toUpperCase() ||
                          "P"}
                      </div>

                      <div
                        style={
                          styles.professionalInfo
                        }
                      >
                        <strong
                          style={
                            styles.professionalName
                          }
                        >
                          {profissional.nome ||
                            "Profissional"}
                        </strong>

                        <span
                          style={
                            styles.professionalCargo
                          }
                        >
                          {profissional.cargo ||
                            "Profissional"}
                        </span>
                      </div>

                      <div
                        style={{
                          ...styles.professionalCheck,
                          backgroundColor:
                            selecionado
                              ? pagina.cor ||
                                "#4A6FFF"
                              : "#f3f4f6",
                          color:
                            selecionado
                              ? "#ffffff"
                              : "#9ca3af",
                        }}
                      >
                        {selecionado
                          ? "✓"
                          : ""}
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          )}

          {profissionalSelecionado && (
            <div
              style={{
                ...styles.selectedProfessional,
                borderColor: `${
                  pagina.cor ||
                  "#4A6FFF"
                }30`,
                backgroundColor: `${
                  pagina.cor ||
                  "#4A6FFF"
                }08`,
              }}
            >
              <span>
                Responsável pelo atendimento:
              </span>

              <strong
                style={{
                  color:
                    pagina.cor ||
                    "#4A6FFF",
                }}
              >
                {
                  profissionalSelecionado.nome
                }
              </strong>
            </div>
          )}
        </section>

        {/* ====================================================
            DATA
        ==================================================== */}

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Escolha uma data
          </h2>

          {!profissionalSelecionado ? (
            <div style={styles.empty}>
              <div
                style={
                  styles.emptyEmoji
                }
              >
                👤
              </div>

              <p
                style={
                  styles.emptyTitle
                }
              >
                Selecione um profissional
              </p>

              <span
                style={styles.emptyText}
              >
                Escolha quem realizará o
                seu atendimento primeiro.
              </span>
            </div>
          ) : (
            <div style={styles.dateGrid}>
              {datas.map((data) => {
                const dataFormatada =
                  formatarData(data);

                const selecionada =
                  dataSelecionada ===
                  dataFormatada;

                return (
                  <button
                    key={dataFormatada}
                    type="button"
                    onClick={() =>
                      selecionarData(
                        dataFormatada
                      )
                    }
                    style={{
                      ...styles.date,
                      borderColor:
                        selecionada
                          ? pagina.cor
                          : "#e5e7eb",
                      backgroundColor:
                        selecionada
                          ? pagina.cor
                          : "#ffffff",
                      color:
                        selecionada
                          ? "#ffffff"
                          : "#374151",
                    }}
                  >
                    <small
                      style={{
                        color:
                          selecionada
                            ? "#ffffff"
                            : "#9ca3af",
                      }}
                    >
                      {formatarDiaSemana(
                        data
                      )}
                    </small>

                    <strong>
                      {data.getDate()}
                    </strong>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* ====================================================
            HORÁRIOS
        ==================================================== */}

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Escolha um horário
          </h2>

          {!profissionalSelecionado ? (
            <div style={styles.empty}>
              <div
                style={
                  styles.emptyEmoji
                }
              >
                👤
              </div>

              <p
                style={
                  styles.emptyTitle
                }
              >
                Selecione um profissional
              </p>

              <span
                style={styles.emptyText}
              >
                Primeiro escolha quem realizará
                o atendimento.
              </span>
            </div>
          ) : !servicoAtual ? (
            <div style={styles.empty}>
              <div
                style={
                  styles.emptyEmoji
                }
              >
                💇
              </div>

              <p
                style={
                  styles.emptyTitle
                }
              >
                Selecione um serviço
              </p>

              <span
                style={styles.emptyText}
              >
                Primeiro escolha o serviço
                que deseja agendar.
              </span>
            </div>
          ) : !dataSelecionada ? (
            <div style={styles.empty}>
              <div
                style={
                  styles.emptyEmoji
                }
              >
                📅
              </div>

              <p
                style={
                  styles.emptyTitle
                }
              >
                Selecione uma data
              </p>

              <span
                style={styles.emptyText}
              >
                Escolha uma data para ver
                os horários disponíveis para{" "}
                {
                  profissionalSelecionado.nome
                }.
              </span>
            </div>
          ) : carregandoHorarios ? (
            <div style={styles.empty}>
              <div
                style={
                  styles.emptyEmoji
                }
              >
                ⏳
              </div>

              <p
                style={
                  styles.emptyTitle
                }
              >
                Verificando horários...
              </p>

              <span
                style={styles.emptyText}
              >
                Estamos verificando os horários
                de{" "}
                {
                  profissionalSelecionado.nome
                }.
              </span>
            </div>
          ) : (
            <div style={styles.timeGrid}>
              {horarios.map((horario) => {
                const selecionado =
                  horarioSelecionado ===
                  horario;

                const ocupado =
                  horariosOcupados.includes(
                    horario
                  );

                return (
                  <button
                    key={horario}
                    type="button"
                    disabled={ocupado}
                    onClick={() =>
                      selecionarHorario(
                        horario
                      )
                    }
                    style={{
                      ...styles.time,
                      borderColor:
                        ocupado
                          ? "#e5e7eb"
                          : selecionado
                          ? pagina.cor
                          : "#e5e7eb",
                      backgroundColor:
                        ocupado
                          ? "#f3f4f6"
                          : selecionado
                          ? pagina.cor
                          : "#ffffff",
                      color:
                        ocupado
                          ? "#9ca3af"
                          : selecionado
                          ? "#ffffff"
                          : "#374151",
                      cursor: ocupado
                        ? "not-allowed"
                        : "pointer",
                      textDecoration:
                        ocupado
                          ? "line-through"
                          : "none",
                      opacity:
                        ocupado ? 0.65 : 1,
                    }}
                  >
                    {horario}

                    {ocupado && (
                      <span
                        style={
                          styles.occupiedLabel
                        }
                      >
                        Ocupado
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* ====================================================
            DADOS DO CLIENTE
        ==================================================== */}

        {servicoAtual &&
          profissionalSelecionado &&
          dataSelecionada &&
          horarioSelecionado && (
            <section
              style={styles.section}
            >
              <h2
                style={
                  styles.sectionTitle
                }
              >
                Seus dados
              </h2>

              <p
                style={
                  styles.clientDescription
                }
              >
                Informe seus dados para
                confirmarmos seu agendamento.
              </p>

              <div
                style={
                  styles.appointmentProfessional
                }
              >
                <div
                  style={{
                    ...styles.professionalMiniAvatar,
                    backgroundColor:
                      profissionalSelecionado.cor ||
                      pagina.cor ||
                      "#4A6FFF",
                  }}
                >
                  {profissionalSelecionado.nome
                    ?.charAt(0)
                    .toUpperCase() ||
                    "P"}
                </div>

                <div>
                  <span
                    style={
                      styles.appointmentLabel
                    }
                  >
                    Profissional
                  </span>

                  <strong>
                    {
                      profissionalSelecionado.nome
                    }
                  </strong>
                </div>
              </div>

              <div
                style={
                  styles.inputGroup
                }
              >
                <label
                  htmlFor="nomeCliente"
                  style={
                    styles.inputLabel
                  }
                >
                  Nome completo
                </label>

                <input
                  id="nomeCliente"
                  type="text"
                  value={nomeCliente}
                  onChange={
                    alterarNomeCliente
                  }
                  placeholder="Digite seu nome"
                  autoComplete="name"
                  style={styles.input}
                  disabled={
                    salvandoAgendamento
                  }
                />
              </div>

              <div
                style={
                  styles.inputGroup
                }
              >
                <label
                  htmlFor="telefoneCliente"
                  style={
                    styles.inputLabel
                  }
                >
                  Telefone
                </label>

                <input
                  id="telefoneCliente"
                  type="tel"
                  value={
                    telefoneCliente
                  }
                  onChange={
                    alterarTelefoneCliente
                  }
                  placeholder="(51) 99999-9999"
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={15}
                  style={styles.input}
                  disabled={
                    salvandoAgendamento
                  }
                />

                <span
                  style={
                    styles.inputHelper
                  }
                >
                  Usaremos este número para
                  contato sobre seu agendamento.
                </span>
              </div>
            </section>
          )}

        {/* ====================================================
            MENSAGEM DE ERRO
        ==================================================== */}

        {mensagemErro && (
          <div
            style={
              styles.errorMessage
            }
          >
            ⚠️ {mensagemErro}
          </div>
        )}

        {/* ====================================================
            MENSAGEM DE SUCESSO
        ==================================================== */}

        {mensagemSucesso && (
          <div
            style={{
              ...styles.successMessage,
              borderColor: `${
                pagina.cor ||
                "#4A6FFF"
              }40`,
              backgroundColor: `${
                pagina.cor ||
                "#4A6FFF"
              }10`,
              color:
                pagina.cor ||
                "#4A6FFF",
            }}
          >
            ✓ {mensagemSucesso}
          </div>
        )}

        {/* ====================================================
            CONFIRMAÇÃO
        ==================================================== */}

        <button
          type="button"
          disabled={!podeAgendar}
          onClick={
            confirmarAgendamento
          }
          style={{
            ...styles.confirmButton,
            backgroundColor:
              podeAgendar
                ? pagina.cor ||
                  "#4A6FFF"
                : "#d1d5db",
            cursor: podeAgendar
              ? "pointer"
              : "not-allowed",
            opacity:
              salvandoAgendamento
                ? 0.7
                : 1,
          }}
        >
          {salvandoAgendamento
            ? "Agendando..."
            : podeAgendar
            ? pagina.textoBotao ||
              "Agendar horário"
            : "Preencha seus dados para agendar"}
        </button>

        <p style={styles.footer}>
          Agendamento rápido, fácil e
          seguro.
        </p>
      </main>
    </div>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    boxSizing: "border-box",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  loadingPage: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
  },

  loadingCard: {
    width: "100%",
    maxWidth: "380px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "35px 25px",
    textAlign: "center",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
    boxSizing: "border-box",
  },

  spinner: {
    fontSize: "28px",
  },

  loadingText: {
    margin: "12px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },

  notFoundIcon: {
    width: "50px",
    height: "50px",
    margin: "0 auto 15px",
    borderRadius: "50%",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "20px",
  },

  errorIcon: {
    width: "50px",
    height: "50px",
    margin: "0 auto 15px",
    borderRadius: "50%",
    backgroundColor: "#fef3c7",
    color: "#d97706",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "20px",
  },

  notFoundTitle: {
    margin: 0,
    fontSize: "20px",
    color: "#111827",
  },

  notFoundText: {
    margin: "8px 0 0",
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: 1.5,
  },

  retryButton: {
    marginTop: "18px",
    width: "100%",
    height: "44px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#4A6FFF",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },

  header: {
    width: "100%",
    padding: "40px 20px 35px",
    color: "#ffffff",
    textAlign: "center",
    boxSizing: "border-box",
  },

  logo: {
    width: "82px",
    height: "82px",
    margin: "0 auto 14px",
    borderRadius: "50%",
    backgroundColor:
      "rgba(255,255,255,0.20)",
    border:
      "4px solid rgba(255,255,255,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    fontSize: "28px",
    fontWeight: 800,
    boxSizing: "border-box",
  },

  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  name: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 800,
    wordBreak: "break-word",
  },

  description: {
    maxWidth: "500px",
    margin: "8px auto 0",
    fontSize: "14px",
    lineHeight: 1.5,
    color:
      "rgba(255,255,255,0.9)",
  },

  content: {
    width: "100%",
    maxWidth: "650px",
    margin: "0 auto",
    padding: "25px 16px 45px",
    boxSizing: "border-box",
  },

  section: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
    border:
      "1px solid #e5e7eb",
    boxSizing: "border-box",
  },

  sectionTitle: {
    margin: "0 0 14px",
    fontSize: "16px",
    fontWeight: 750,
    color: "#111827",
  },

  // ==========================================================
  // PROFISSIONAIS
  // ==========================================================

  professionalDescription: {
    margin: "-5px 0 15px",
    fontSize: "12px",
    color: "#6b7280",
    lineHeight: 1.5,
  },

  professionalGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },

  professional: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    border: "1px solid",
    borderRadius: "12px",
    cursor: "pointer",
    textAlign: "left",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition:
      "all 0.15s ease",
  },

  professionalAvatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 800,
    flexShrink: 0,
  },

  professionalInfo: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  professionalName: {
    fontSize: "14px",
    color: "#111827",
  },

  professionalCargo: {
    fontSize: "11px",
    color: "#9ca3af",
  },

  professionalCheck: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: "12px",
    fontWeight: 800,
  },

  selectedProfessional: {
    marginTop: "12px",
    padding: "10px 12px",
    border: "1px solid",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    fontSize: "11px",
  },

  // ==========================================================
  // PROFISSIONAL NO RESUMO
  // ==========================================================

  appointmentProfessional: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "11px",
    borderRadius: "10px",
    backgroundColor: "#f9fafb",
    marginBottom: "17px",
  },

  professionalMiniAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 800,
    flexShrink: 0,
  },

  appointmentLabel: {
    display: "block",
    fontSize: "10px",
    color: "#9ca3af",
    marginBottom: "2px",
  },

  // ==========================================================
  // CLIENTE
  // ==========================================================

  clientDescription: {
    margin: "-5px 0 18px",
    fontSize: "12px",
    color: "#6b7280",
    lineHeight: 1.5,
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    marginBottom: "15px",
  },

  inputLabel: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#374151",
  },

  input: {
    width: "100%",
    height: "46px",
    padding: "0 13px",
    border:
      "1px solid #d1d5db",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    color: "#111827",
    fontSize: "13px",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  },

  inputHelper: {
    fontSize: "10px",
    color: "#9ca3af",
    lineHeight: 1.4,
  },

  // ==========================================================
  // SERVIÇOS
  // ==========================================================

  services: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  service: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "13px",
    border: "1px solid",
    borderRadius: "12px",
    cursor: "pointer",
    textAlign: "left",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },

  serviceLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: 0,
    flex: 1,
  },

  serviceIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: "15px",
  },

  serviceInfo: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  serviceName: {
    fontSize: "14px",
    color: "#111827",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  serviceDuration: {
    fontSize: "11px",
    color: "#9ca3af",
  },

  price: {
    flexShrink: 0,
    fontSize: "14px",
    color: "#111827",
  },

  // ==========================================================
  // DATAS
  // ==========================================================

  dateGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(7, minmax(0, 1fr))",
    gap: "7px",
  },

  date: {
    minWidth: 0,
    padding: "10px 4px",
    border: "1px solid",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
    fontFamily: "inherit",
  },

  // ==========================================================
  // HORÁRIOS
  // ==========================================================

  timeGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "8px",
  },

  time: {
    minHeight: "42px",
    border: "1px solid",
    borderRadius: "9px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    position: "relative",
  },

  occupiedLabel: {
    display: "block",
    fontSize: "8px",
    marginTop: "2px",
    fontWeight: 500,
  },

  // ==========================================================
  // VAZIOS
  // ==========================================================

  empty: {
    padding: "25px 15px",
    border:
      "1px dashed #d1d5db",
    borderRadius: "12px",
    textAlign: "center",
    backgroundColor: "#fafafa",
  },

  emptyIcon: {
    width: "42px",
    height: "42px",
    margin: "0 auto 10px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
  },

  emptyEmoji: {
    fontSize: "24px",
    marginBottom: "8px",
  },

  emptyTitle: {
    margin: 0,
    fontSize: "13px",
    fontWeight: 700,
    color: "#374151",
  },

  emptyText: {
    display: "block",
    marginTop: "5px",
    fontSize: "11px",
    color: "#9ca3af",
  },

  // ==========================================================
  // MENSAGENS
  // ==========================================================

  errorMessage: {
    marginBottom: "12px",
    padding: "13px 15px",
    borderRadius: "10px",
    backgroundColor: "#fef2f2",
    border:
      "1px solid #fecaca",
    color: "#dc2626",
    fontSize: "12px",
    lineHeight: 1.5,
  },

  successMessage: {
    marginBottom: "12px",
    padding: "13px 15px",
    borderRadius: "10px",
    border: "1px solid",
    fontSize: "12px",
    lineHeight: 1.5,
    fontWeight: 600,
  },

  // ==========================================================
  // BOTÃO
  // ==========================================================

  confirmButton: {
    width: "100%",
    height: "50px",
    border: "none",
    borderRadius: "11px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 700,
    fontFamily: "inherit",
  },

  footer: {
    margin: "13px 0 0",
    textAlign: "center",
    fontSize: "11px",
    color: "#9ca3af",
  },
};

export default PaginaPublica;