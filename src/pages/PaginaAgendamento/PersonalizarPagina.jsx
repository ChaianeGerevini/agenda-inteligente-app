import { useEffect, useState } from "react";

import { useUser } from "../../contexts/UserContext";

import { db } from "../../services/firebase.js";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

function PersonalizarPagina() {
  const { usuario } = useUser();

  // ============================================================
  // CONFIGURAÇÃO DA PÁGINA
  // ============================================================

  const [config, setConfig] = useState({
    nome: "",
    descricao: "Agende seu horário de forma rápida e fácil.",
    cor: "#4A6FFF",
    logo: null,
    textoBotao: "Agendar horário",
    servicos: [],
  });

  // ============================================================
  // ESTADOS DO PREVIEW
  // ============================================================

  const [servicoSelecionado, setServicoSelecionado] =
    useState(null);

  const [dataSelecionada, setDataSelecionada] =
    useState(null);

  const [horarioSelecionado, setHorarioSelecionado] =
    useState(null);

  const [servicoAberto, setServicoAberto] =
    useState(null);

  // ============================================================
  // ESTADOS DE SALVAMENTO
  // ============================================================

  const [salvando, setSalvando] = useState(false);

  const [mensagem, setMensagem] = useState("");

  // ============================================================
  // ESTADO DO LINK
  // ============================================================

  const [linkCopiado, setLinkCopiado] = useState(false);

  // ============================================================
  // LINK PÚBLICO DA PÁGINA
  // ============================================================

  /*
    IMPORTANTE:

    Esta é a URL pública que será usada pelos três botões.

    Atualmente está configurada como:

    /agendar/ID_DO_USUARIO

    Exemplo:

    https://seusite.com/agendar/abc123

    Se a sua rota pública tiver outro formato, basta alterar
    SOMENTE esta linha.
  */

  const linkPagina = usuario?.uid
    ? `${window.location.origin}/agendar/${usuario.uid}`
    : "";

  // ============================================================
  // CARREGAR CONFIGURAÇÃO
  // ============================================================

  useEffect(() => {
    const carregarConfiguracao = async () => {
      if (!usuario?.uid) return;

      try {
        const usuarioRef = doc(
          db,
          "usuarios",
          usuario.uid
        );

        const usuarioSnap = await getDoc(
          usuarioRef
        );

        if (usuarioSnap.exists()) {
          const dados = usuarioSnap.data();

          if (dados.paginaAgendamento) {
            setConfig((anterior) => ({
              ...anterior,
              ...dados.paginaAgendamento,
              servicos:
                dados.paginaAgendamento.servicos || [],
            }));
          }
        }
      } catch (error) {
        console.error(
          "Erro ao carregar configuração:",
          error
        );
      }
    };

    carregarConfiguracao();
  }, [usuario?.uid]);

  // ============================================================
  // HORÁRIOS
  // ============================================================

  const horariosBase = [
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

  const datasDisponiveis = gerarDatas();

  // ============================================================
  // FORMATAÇÕES
  // ============================================================

  const formatarDiaSemana = (data) => {
    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "short",
    })
      .format(data)
      .replace(".", "")
      .slice(0, 3)
      .toUpperCase();
  };

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

  const formatarValor = (valor) => {
    if (
      valor === "" ||
      valor === null
    ) {
      return "R$ 0,00";
    }

    return `R$ ${Number(valor)
      .toFixed(2)
      .replace(".", ",")}`;
  };

  // ============================================================
  // SERVIÇO ATUAL
  // ============================================================

  const servicoAtual =
    config.servicos.find(
      (servico) =>
        servico.id === servicoSelecionado
    );

  // ============================================================
  // HORÁRIOS DISPONÍVEIS
  // ============================================================

  const horariosDisponiveis =
    servicoAtual
      ? horariosBase
      : [];

  // ============================================================
  // ALTERAR CONFIGURAÇÃO
  // ============================================================

  const alterarCampo = (
    campo,
    valor
  ) => {
    setConfig((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  };

  // ============================================================
  // ADICIONAR SERVIÇO
  // ============================================================

  const adicionarServico = () => {
    const novoServico = {
      id: crypto.randomUUID(),
      nome: "",
      valor: "",
      duracao: 60,
    };

    setConfig((anterior) => ({
      ...anterior,
      servicos: [
        ...anterior.servicos,
        novoServico,
      ],
    }));

    setServicoAberto(
      novoServico.id
    );
  };

  // ============================================================
  // ALTERAR SERVIÇO
  // ============================================================

  const alterarServico = (
    id,
    campo,
    valor
  ) => {
    setConfig((anterior) => ({
      ...anterior,
      servicos:
        anterior.servicos.map(
          (servico) =>
            servico.id === id
              ? {
                  ...servico,
                  [campo]: valor,
                }
              : servico
        ),
    }));
  };

  // ============================================================
  // REMOVER SERVIÇO
  // ============================================================

  const removerServico = (id) => {
    setConfig((anterior) => ({
      ...anterior,
      servicos:
        anterior.servicos.filter(
          (servico) =>
            servico.id !== id
        ),
    }));

    if (
      servicoSelecionado === id
    ) {
      setServicoSelecionado(null);
      setHorarioSelecionado(null);
    }

    if (
      servicoAberto === id
    ) {
      setServicoAberto(null);
    }
  };

  // ============================================================
  // ALTERAR LOGO
  // ============================================================

  const alterarLogo = (e) => {
    const arquivo = e.target.files?.[0];

    if (!arquivo) return;

    if (
      !arquivo.type.startsWith("image/")
    ) {
      alert("Selecione uma imagem válida.");
      return;
    }

    if (
      arquivo.size >
      5 * 1024 * 1024
    ) {
      alert(
        "A logo deve ter no máximo 5 MB."
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imagem = new Image();

      imagem.onload = () => {
        const tamanhoMaximo = 500;

        let largura = imagem.width;
        let altura = imagem.height;

        if (largura > altura) {
          if (
            largura >
            tamanhoMaximo
          ) {
            altura =
              (altura *
                tamanhoMaximo) /
              largura;

            largura =
              tamanhoMaximo;
          }
        } else {
          if (
            altura >
            tamanhoMaximo
          ) {
            largura =
              (largura *
                tamanhoMaximo) /
              altura;

            altura =
              tamanhoMaximo;
          }
        }

        const canvas =
          document.createElement(
            "canvas"
          );

        canvas.width = largura;
        canvas.height = altura;

        const contexto =
          canvas.getContext("2d");

        contexto.drawImage(
          imagem,
          0,
          0,
          largura,
          altura
        );

        const imagemBase64 =
          canvas.toDataURL(
            "image/jpeg",
            0.75
          );

        setConfig((anterior) => ({
          ...anterior,
          logo: imagemBase64,
        }));
      };

      imagem.src = reader.result;
    };

    reader.readAsDataURL(arquivo);

    e.target.value = "";
  };

  // ============================================================
  // SELECIONAR SERVIÇO
  // ============================================================

  const selecionarServico = (
    id
  ) => {
    setServicoSelecionado(id);

    setHorarioSelecionado(null);
  };

  // ============================================================
  // SELECIONAR DATA
  // ============================================================

  const selecionarData = (
    data
  ) => {
    setDataSelecionada(data);

    setHorarioSelecionado(null);
  };

  // ============================================================
  // SELECIONAR HORÁRIO
  // ============================================================

  const selecionarHorario = (
    horario
  ) => {
    setHorarioSelecionado(
      horario
    );
  };

  // ============================================================
  // SALVAR PÁGINA
  // ============================================================

  const salvarPagina = async () => {
    if (!usuario?.uid) {
      setMensagem(
        "Usuário não encontrado."
      );

      return;
    }

    try {
      setSalvando(true);
      setMensagem("");

      const usuarioRef = doc(
        db,
        "usuarios",
        usuario.uid
      );

      const dadosPagina = {
        ...config,

        logo: config.logo || null,
      };

      await setDoc(
        usuarioRef,
        {
          paginaAgendamento:
            dadosPagina,
        },
        {
          merge: true,
        }
      );

      setMensagem(
        "Página salva com sucesso!"
      );

      console.log(
        "Página salva:",
        dadosPagina
      );
    } catch (error) {
      console.error(
        "Erro ao salvar página:",
        error
      );

      setMensagem(
        "Não foi possível salvar a página."
      );
    } finally {
      setSalvando(false);
    }
  };

  // ============================================================
  // VISUALIZAR PÁGINA
  // ============================================================

  const visualizarPagina = () => {
    if (!linkPagina) {
      alert(
        "Não foi possível gerar o link da página."
      );

      return;
    }

    window.open(
      linkPagina,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ============================================================
  // COPIAR LINK
  // ============================================================

  const copiarLink = async () => {
    if (!linkPagina) {
      alert(
        "Não foi possível gerar o link da página."
      );

      return;
    }

    try {
      await navigator.clipboard.writeText(
        linkPagina
      );

      setLinkCopiado(true);

      setTimeout(() => {
        setLinkCopiado(false);
      }, 2500);
    } catch (error) {
      console.error(
        "Erro ao copiar link:",
        error
      );

      alert(
        "Não foi possível copiar o link."
      );
    }
  };

  // ============================================================
  // COMPARTILHAR LINK
  // ============================================================

  const compartilharLink = async () => {
    if (!linkPagina) {
      alert(
        "Não foi possível gerar o link da página."
      );

      return;
    }

    const titulo =
      config.nome ||
      "Minha página de agendamento";

    const texto =
      "Agende seu horário de forma rápida e fácil.";

    try {
      if (
        navigator.share
      ) {
        await navigator.share({
          title: titulo,
          text: texto,
          url: linkPagina,
        });

        return;
      }

      await navigator.clipboard.writeText(
        linkPagina
      );

      setLinkCopiado(true);

      setTimeout(() => {
        setLinkCopiado(false);
      }, 2500);

      alert(
        "Seu navegador não possui compartilhamento direto. O link foi copiado."
      );
    } catch (error) {
      if (
        error?.name ===
        "AbortError"
      ) {
        return;
      }

      console.error(
        "Erro ao compartilhar:",
        error
      );
    }
  };

  // ============================================================
  // VERIFICAÇÃO DO AGENDAMENTO
  // ============================================================

  const podeAgendar =
    Boolean(
      servicoSelecionado &&
        dataSelecionada &&
        horarioSelecionado
    );

  // ============================================================
  // CONFIRMAR AGENDAMENTO
  // ============================================================

  const confirmarAgendamento = () => {
    if (!podeAgendar) return;

    const servico =
      config.servicos.find(
        (item) =>
          item.id ===
          servicoSelecionado
      );

    console.log(
      "Agendamento:",
      {
        servico,
        data:
          dataSelecionada,
        horario:
          horarioSelecionado,
      }
    );

    alert(
      `Agendamento selecionado!\n\n${
        servico?.nome ||
        "Serviço"
      }\n${dataSelecionada}\n${horarioSelecionado}`
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div style={styles.page}>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header style={styles.header}>

        <div style={styles.headerInfo}>

          <h1 style={styles.title}>
            Personalizar página
          </h1>

          <p style={styles.subtitle}>
            Personalize a aparência da sua
            página de agendamento.
          </p>

        </div>

        {/* ==================================================
            AÇÕES DA PÁGINA
        ================================================== */}

        <div style={styles.headerActions}>

          {/* VISUALIZAR */}

          <button
            type="button"
            style={styles.previewButton}
            onClick={visualizarPagina}
            disabled={!usuario?.uid}
          >
            <span style={styles.buttonIcon}>
              ↗
            </span>

            Visualizar página
          </button>

          {/* COMPARTILHAR */}

          <button
            type="button"
            style={styles.shareButton}
            onClick={compartilharLink}
            disabled={!usuario?.uid}
          >
            <span style={styles.buttonIcon}>
              ↗
            </span>

            Compartilhar link
          </button>

          {/* COPIAR */}

          <button
            type="button"
            style={{
              ...styles.copyButton,
              backgroundColor:
                linkCopiado
                  ? "#16a34a"
                  : "#ffffff",
              color:
                linkCopiado
                  ? "#ffffff"
                  : "#374151",
            }}
            onClick={copiarLink}
            disabled={!usuario?.uid}
          >
            <span style={styles.buttonIcon}>
              {linkCopiado
                ? "✓"
                : "⧉"}
            </span>

            {linkCopiado
              ? "Link copiado!"
              : "Copiar link"}
          </button>

          {/* SALVAR */}

          <button
            type="button"
            style={{
              ...styles.saveButton,
              opacity:
                salvando ? 0.7 : 1,
              cursor:
                salvando
                  ? "not-allowed"
                  : "pointer",
            }}
            onClick={salvarPagina}
            disabled={salvando}
          >
            {salvando
              ? "Salvando..."
              : "Salvar página"}
          </button>

        </div>

        {mensagem && (
          <span
            style={{
              ...styles.saveMessage,
              color:
                mensagem.includes(
                  "sucesso"
                )
                  ? "#16a34a"
                  : "#dc2626",
            }}
          >
            {mensagem}
          </span>
        )}

      </header>

      {/* ======================================================
          LAYOUT PRINCIPAL
      ====================================================== */}

      <main style={styles.mainLayout}>

        {/* ====================================================
            EDITOR
        ==================================================== */}

        <section style={styles.editor}>

          <h2 style={styles.editorTitle}>
            Editar página
          </h2>

          {/* ==================================================
              LOGO
          ================================================== */}

          <div style={styles.field}>

            <label style={styles.label}>
              Logo do negócio
            </label>

            <label
              style={styles.uploadButton}
            >
              {config.logo
                ? "Alterar logo"
                : "Escolher logo"}

              <input
                type="file"
                accept="image/*"
                onChange={
                  alterarLogo
                }
                style={
                  styles.hiddenInput
                }
              />
            </label>

            {config.logo && (
              <div
                style={
                  styles.smallLogoContainer
                }
              >
                <img
                  src={config.logo}
                  alt="Logo"
                  style={
                    styles.smallLogo
                  }
                />
              </div>
            )}

            <small
              style={
                styles.helperText
              }
            >
              Recomendamos uma
              imagem quadrada.
              <br />
              Tamanho máximo: 5 MB.
            </small>

          </div>

          {/* ==================================================
              NOME
          ================================================== */}

          <div style={styles.field}>

            <label style={styles.label}>
              Nome da página
            </label>

            <input
              type="text"
              placeholder="Ex: Studio Chaiane"
              value={config.nome}
              onChange={(e) =>
                alterarCampo(
                  "nome",
                  e.target.value
                )
              }
              style={styles.input}
            />

          </div>

          {/* ==================================================
              SERVIÇOS
          ================================================== */}

          <div
            style={
              styles.servicesSection
            }
          >

            <div
              style={
                styles.servicesHeader
              }
            >

              <div>

                <h3
                  style={
                    styles.servicesTitle
                  }
                >
                  Serviços
                </h3>

                <p
                  style={
                    styles.servicesSubtitle
                  }
                >
                  Cadastre os serviços
                  que seus clientes
                  poderão agendar.
                </p>

              </div>

            </div>

            {config.servicos.length ===
            0 ? (

              <div
                style={
                  styles.emptyServices
                }
              >

                <span
                  style={
                    styles.emptyServicesIcon
                  }
                >
                  ✦
                </span>

                <p
                  style={
                    styles.emptyServicesText
                  }
                >
                  Nenhum serviço
                  cadastrado.
                </p>

                <small
                  style={
                    styles.emptyServicesHelper
                  }
                >
                  Adicione seu primeiro
                  serviço abaixo.
                </small>

              </div>

            ) : (

              <div
                style={
                  styles.servicesList
                }
              >

                {config.servicos.map(
                  (
                    servico,
                    index
                  ) => {

                    const aberto =
                      servicoAberto ===
                      servico.id;

                    return (
                      <div
                        key={
                          servico.id
                        }
                        style={
                          styles.serviceEditorCard
                        }
                      >

                        {/* DROPDOWN */}

                        <button
                          type="button"
                          style={
                            styles.serviceDropdownButton
                          }
                          onClick={() =>
                            setServicoAberto(
                              aberto
                                ? null
                                : servico.id
                            )
                          }
                        >

                          <div
                            style={
                              styles.serviceDropdownInfo
                            }
                          >

                            <div
                              style={{
                                ...styles.serviceDropdownIcon,
                                backgroundColor:
                                  `${config.cor}18`,
                                color:
                                  config.cor,
                              }}
                            >
                              ✦
                            </div>

                            <div
                              style={
                                styles.serviceDropdownText
                              }
                            >

                              <strong
                                style={{
                                  color:
                                    "#111827",
                                  overflow:
                                    "hidden",
                                  textOverflow:
                                    "ellipsis",
                                  whiteSpace:
                                    "nowrap",
                                }}
                              >
                                {servico.nome ||
                                  `Serviço ${
                                    index + 1
                                  }`}
                              </strong>

                              {!aberto &&
                                servico.valor !==
                                  "" && (
                                  <span>
                                    {formatarValor(
                                      servico.valor
                                    )}
                                  </span>
                                )}

                            </div>

                          </div>

                          <span
                            style={
                              styles.dropdownArrow
                            }
                          >
                            {aberto
                              ? "⌃"
                              : "⌄"}
                          </span>

                        </button>

                        {/* CONTEÚDO */}

                        {aberto && (

                          <div
                            style={
                              styles.serviceEditorContent
                            }
                          >

                            {/* NOME */}

                            <div
                              style={
                                styles.field
                              }
                            >

                              <label
                                style={
                                  styles.label
                                }
                              >
                                Nome do serviço
                              </label>

                              <input
                                type="text"
                                placeholder="Ex: Manicure"
                                value={
                                  servico.nome
                                }
                                onChange={(e) =>
                                  alterarServico(
                                    servico.id,
                                    "nome",
                                    e.target.value
                                  )
                                }
                                style={
                                  styles.input
                                }
                              />

                            </div>

                            {/* VALOR */}

                            <div
                              style={
                                styles.field
                              }
                            >

                              <label
                                style={
                                  styles.label
                                }
                              >
                                Valor
                              </label>

                              <div
                                style={
                                  styles.currencyInputWrapper
                                }
                              >

                                <span
                                  style={
                                    styles.currencyPrefix
                                  }
                                >
                                  R$
                                </span>

                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="50,00"
                                  value={
                                    servico.valor
                                  }
                                  onChange={(e) =>
                                    alterarServico(
                                      servico.id,
                                      "valor",
                                      e.target.value
                                    )
                                  }
                                  style={
                                    styles.currencyInput
                                  }
                                />

                              </div>

                            </div>

                            {/* DURAÇÃO */}

                            <div
                              style={
                                styles.field
                              }
                            >

                              <label
                                style={
                                  styles.label
                                }
                              >
                                Duração do serviço
                              </label>

                              <select
                                value={
                                  servico.duracao
                                }
                                onChange={(e) =>
                                  alterarServico(
                                    servico.id,
                                    "duracao",
                                    Number(
                                      e.target.value
                                    )
                                  )
                                }
                                style={
                                  styles.select
                                }
                              >

                                <option value={15}>
                                  15 minutos
                                </option>

                                <option value={30}>
                                  30 minutos
                                </option>

                                <option value={45}>
                                  45 minutos
                                </option>

                                <option value={60}>
                                  1 hora
                                </option>

                                <option value={90}>
                                  1 hora e 30 minutos
                                </option>

                                <option value={120}>
                                  2 horas
                                </option>

                                <option value={150}>
                                  2 horas e 30 minutos
                                </option>

                                <option value={180}>
                                  3 horas
                                </option>

                              </select>

                              <small
                                style={
                                  styles.helperText
                                }
                              >
                                A duração será
                                usada futuramente
                                para controlar
                                os horários
                                disponíveis.
                              </small>

                            </div>

                            {/* EXCLUIR */}

                            <button
                              type="button"
                              style={
                                styles.deleteServiceButton
                              }
                              onClick={() =>
                                removerServico(
                                  servico.id
                                )
                              }
                            >
                              Excluir serviço
                            </button>

                          </div>

                        )}

                      </div>
                    );
                  }
                )}

              </div>
            )}

            {/* ADICIONAR */}

            <button
              type="button"
              style={{
                ...styles.addServiceButton,
                borderColor:
                  config.cor,
                color:
                  config.cor,
              }}
              onClick={
                adicionarServico
              }
            >

              <span
                style={
                  styles.addServiceIcon
                }
              >
                +
              </span>

              Adicionar serviço

            </button>

          </div>

          {/* ==================================================
              DESCRIÇÃO
          ================================================== */}

          <div style={styles.field}>

            <label style={styles.label}>
              Descrição
            </label>

            <textarea
              placeholder="Ex: Agende seu horário comigo"
              value={
                config.descricao
              }
              onChange={(e) =>
                alterarCampo(
                  "descricao",
                  e.target.value
                )
              }
              style={
                styles.textarea
              }
            />

          </div>

          {/* ==================================================
              COR
          ================================================== */}

          <div style={styles.field}>

            <label style={styles.label}>
              Cor principal
            </label>

            <div
              style={
                styles.colorRow
              }
            >

              <input
                type="color"
                value={
                  config.cor
                }
                onChange={(e) =>
                  alterarCampo(
                    "cor",
                    e.target.value
                  )
                }
                style={
                  styles.colorInput
                }
              />

              <span
                style={
                  styles.colorCode
                }
              >
                {config.cor}
              </span>

            </div>

          </div>

          {/* ==================================================
              TEXTO BOTÃO
          ================================================== */}

          <div style={styles.field}>

            <label style={styles.label}>
              Texto do botão
            </label>

            <input
              type="text"
              placeholder="Agendar horário"
              value={
                config.textoBotao
              }
              onChange={(e) =>
                alterarCampo(
                  "textoBotao",
                  e.target.value
                )
              }
              style={
                styles.input
              }
            />

          </div>

          {/* ==================================================
              DICA
          ================================================== */}

          <div style={styles.tip}>

            <strong
              style={
                styles.tipStrong
              }
            >
              Dica
            </strong>

            <p
              style={
                styles.tipText
              }
            >
              Todas as alterações
              aparecem automaticamente
              no preview.
            </p>

          </div>

        </section>

        {/* ====================================================
            PREVIEW
        ==================================================== */}

        <section
          style={
            styles.previewPanel
          }
        >

          {/* HEADER DO PREVIEW */}

          <div
            style={
              styles.previewPanelHeader
            }
          >

            <div>

              <h2
                style={
                  styles.previewTitle
                }
              >
                Preview
              </h2>

              <p
                style={
                  styles.previewDescription
                }
              >
                Veja como sua página
                aparecerá para seus
                clientes.
              </p>

            </div>

            <span
              style={
                styles.previewBadge
              }
            >
              ● Visualização
            </span>

          </div>

          {/* ÁREA DO PREVIEW */}

          <div
            style={
              styles.previewArea
            }
          >

            {/* PÁGINA DO CLIENTE */}

            <div
              style={
                styles.customerPage
              }
            >

              {/* HEADER CLIENTE */}

              <div
                style={{
                  ...styles.customerHeader,
                  backgroundColor:
                    config.cor,
                }}
              >

                {/* LOGO */}

                <div
                  style={
                    styles.customerLogo
                  }
                >

                  {config.logo ? (

                    <img
                      src={
                        config.logo
                      }
                      alt="Logo"
                      style={
                        styles.customerLogoImage
                      }
                    />

                  ) : (

                    <span>
                      {config.nome
                        ? config.nome
                            .charAt(0)
                            .toUpperCase()
                        : "P"}
                    </span>

                  )}

                </div>

                {/* NOME */}

                <h1
                  style={
                    styles.customerName
                  }
                >
                  {config.nome ||
                    "Nome da sua página"}
                </h1>

                {/* DESCRIÇÃO */}

                <p
                  style={
                    styles.customerDescription
                  }
                >
                  {config.descricao}
                </p>

              </div>

              {/* CONTEÚDO */}

              <div
                style={
                  styles.customerContent
                }
              >

                {/* =================================================
                    SERVIÇOS
                ================================================= */}

                <div
                  style={
                    styles.customerSection
                  }
                >

                  <h3
                    style={
                      styles.sectionHeading
                    }
                  >
                    Escolha um serviço
                  </h3>

                  {config.servicos
                    .length === 0 ? (

                    <div
                      style={
                        styles.emptyPreviewServices
                      }
                    >

                      <div
                        style={{
                          ...styles.emptyPreviewIcon,
                          backgroundColor:
                            `${config.cor}18`,
                          color:
                            config.cor,
                        }}
                      >
                        ✦
                      </div>

                      <p
                        style={
                          styles.emptyPreviewTitle
                        }
                      >
                        Nenhum serviço
                        cadastrado
                      </p>

                      <small
                        style={
                          styles.emptyPreviewText
                        }
                      >
                        Os serviços
                        adicionados
                        aparecerão aqui.
                      </small>

                    </div>

                  ) : (

                    <div
                      style={
                        styles.previewServicesList
                      }
                    >

                      {config.servicos.map(
                        (servico) => {

                          const selecionado =
                            servicoSelecionado ===
                            servico.id;

                          return (

                            <button
                              key={
                                servico.id
                              }
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
                                    ? config.cor
                                    : "#e5e7eb",
                                backgroundColor:
                                  selecionado
                                    ? `${config.cor}08`
                                    : "#ffffff",
                                boxShadow:
                                  selecionado
                                    ? `0 0 0 2px ${config.cor}20`
                                    : "none",
                              }}
                            >

                              <div
                                style={
                                  styles.serviceInfo
                                }
                              >

                                <div
                                  style={{
                                    ...styles.serviceIcon,
                                    backgroundColor:
                                      selecionado
                                        ? config.cor
                                        : `${config.cor}18`,
                                    color:
                                      selecionado
                                        ? "#ffffff"
                                        : config.cor,
                                  }}
                                >
                                  {selecionado
                                    ? "✓"
                                    : "✦"}
                                </div>

                                <div
                                  style={
                                    styles.serviceDetails
                                  }
                                >

                                  <strong
                                    style={
                                      styles.serviceName
                                    }
                                  >
                                    {servico.nome ||
                                      "Serviço sem nome"}
                                  </strong>

                                  <p
                                    style={
                                      styles.serviceDescription
                                    }
                                  >
                                    Atendimento
                                    profissional
                                  </p>

                                </div>

                              </div>

                              <strong
                                style={
                                  styles.servicePrice
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

                </div>

                {/* =================================================
                    DATAS
                ================================================= */}

                <div
                  style={
                    styles.customerSection
                  }
                >

                  <h3
                    style={
                      styles.sectionHeading
                    }
                  >
                    Escolha uma data
                  </h3>

                  <div
                    style={
                      styles.dateGrid
                    }
                  >

                    {datasDisponiveis.map(
                      (data) => {

                        const dataFormatada =
                          formatarData(
                            data
                          );

                        const selecionada =
                          dataSelecionada ===
                          dataFormatada;

                        return (

                          <button
                            key={
                              dataFormatada
                            }
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
                                  ? config.cor
                                  : "#e5e7eb",
                              backgroundColor:
                                selecionada
                                  ? config.cor
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
                              {
                                data.getDate()
                              }
                            </strong>

                          </button>

                        );
                      }
                    )}

                  </div>

                </div>

                {/* =================================================
                    HORÁRIOS
                ================================================= */}

                <div
                  style={
                    styles.customerSection
                  }
                >

                  <h3
                    style={
                      styles.sectionHeading
                    }
                  >
                    Escolha um horário
                  </h3>

                  {!servicoAtual ? (

                    <div
                      style={
                        styles.timeEmpty
                      }
                    >

                      <span
                        style={
                          styles.timeEmptyIcon
                        }
                      >
                        🕐
                      </span>

                      <p
                        style={
                          styles.timeEmptyText
                        }
                      >
                        Selecione um
                        serviço primeiro
                      </p>

                      <small
                        style={
                          styles.timeEmptyHelper
                        }
                      >
                        Os horários
                        disponíveis
                        aparecerão aqui.
                      </small>

                    </div>

                  ) : !dataSelecionada ? (

                    <div
                      style={
                        styles.timeEmpty
                      }
                    >

                      <span
                        style={
                          styles.timeEmptyIcon
                        }
                      >
                        📅
                      </span>

                      <p
                        style={
                          styles.timeEmptyText
                        }
                      >
                        Selecione uma
                        data primeiro
                      </p>

                      <small
                        style={
                          styles.timeEmptyHelper
                        }
                      >
                        Depois escolha
                        um horário.
                      </small>

                    </div>

                  ) : (

                    <div
                      style={
                        styles.timeGrid
                      }
                    >

                      {horariosDisponiveis.map(
                        (horario) => {

                          const selecionado =
                            horarioSelecionado ===
                            horario;

                          return (

                            <button
                              key={
                                horario
                              }
                              type="button"
                              onClick={() =>
                                selecionarHorario(
                                  horario
                                )
                              }
                              style={{
                                ...styles.time,
                                borderColor:
                                  selecionado
                                    ? config.cor
                                    : "#e5e7eb",
                                backgroundColor:
                                  selecionado
                                    ? config.cor
                                    : "#ffffff",
                                color:
                                  selecionado
                                    ? "#ffffff"
                                    : "#374151",
                              }}
                            >
                              {horario}
                            </button>

                          );
                        }
                      )}

                    </div>

                  )}

                </div>

                {/* =================================================
                    BOTÃO
                ================================================= */}

                <button
                  type="button"
                  disabled={
                    !podeAgendar
                  }
                  onClick={
                    confirmarAgendamento
                  }
                  style={{
                    ...styles.customerButton,
                    backgroundColor:
                      podeAgendar
                        ? config.cor
                        : "#d1d5db",
                    cursor:
                      podeAgendar
                        ? "pointer"
                        : "not-allowed",
                    opacity:
                      podeAgendar
                        ? 1
                        : 0.8,
                  }}
                >
                  {podeAgendar
                    ? config.textoBotao ||
                      "Agendar horário"
                    : !servicoSelecionado
                    ? "Selecione um serviço"
                    : !dataSelecionada
                    ? "Selecione uma data"
                    : "Selecione um horário"}
                </button>

                <p
                  style={
                    styles.footerText
                  }
                >
                  Agendamento rápido,
                  fácil e seguro.
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "20px 16px 40px",
    boxSizing: "border-box",
    overflowX: "hidden",
  },

  header: {
    width: "100%",
    maxWidth: "1250px",
    margin: "0 auto 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
  },

  headerInfo: {
    minWidth: 0,
    flex: 1,
  },

  title: {
    margin: 0,
    fontSize: "25px",
    fontWeight: 800,
    color: "#111827",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: 1.4,
  },

  // ==========================================================
  // BOTÕES DO HEADER
  // ==========================================================

  headerActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "8px",
    flexWrap: "wrap",
  },

  previewButton: {
    minHeight: "42px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#374151",
    padding: "0 13px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    whiteSpace: "nowrap",
  },

  shareButton: {
    minHeight: "42px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#374151",
    padding: "0 13px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    whiteSpace: "nowrap",
  },

  copyButton: {
    minHeight: "42px",
    border: "1px solid #d1d5db",
    padding: "0 13px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    whiteSpace: "nowrap",
  },

  buttonIcon: {
    fontSize: "15px",
    lineHeight: 1,
  },

  saveButton: {
    flexShrink: 0,
    border: "none",
    backgroundColor: "#111827",
    color: "#ffffff",
    padding: "12px 17px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    minHeight: "42px",
  },

  saveMessage: {
    fontSize: "12px",
    fontWeight: 600,
    width: "100%",
    textAlign: "right",
  },

  // ==========================================================
  // LAYOUT
  // ==========================================================

  mainLayout: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "stretch",
  },

  // ==========================================================
  // EDITOR
  // ==========================================================

  editor: {
    width: "100%",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "20px",
    boxSizing: "border-box",
    minWidth: 0,
  },

  editorTitle: {
    margin: "0 0 20px",
    fontSize: "18px",
    color: "#111827",
  },

  field: {
    marginBottom: "18px",
    minWidth: 0,
  },

  label: {
    display: "block",
    marginBottom: "7px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  },

  input: {
    width: "100%",
    height: "44px",
    padding: "0 12px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
    color: "#111827",
    backgroundColor: "#ffffff",
  },

  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "11px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    fontSize: "14px",
    lineHeight: 1.5,
    boxSizing: "border-box",
    color: "#111827",
  },

  // ==========================================================
  // LOGO
  // ==========================================================

  uploadButton: {
    width: "100%",
    minHeight: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 14px",
    borderRadius: "9px",
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#374151",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    boxSizing: "border-box",
  },

  hiddenInput: {
    display: "none",
  },

  smallLogoContainer: {
    width: "52px",
    height: "52px",
    marginTop: "12px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
  },

  smallLogo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  helperText: {
    display: "block",
    marginTop: "7px",
    color: "#9ca3af",
    fontSize: "11px",
    lineHeight: 1.4,
  },

  // ==========================================================
  // SERVIÇOS EDITOR
  // ==========================================================

  servicesSection: {
    marginBottom: "22px",
  },

  servicesHeader: {
    marginBottom: "12px",
  },

  servicesTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: 700,
    color: "#111827",
  },

  servicesSubtitle: {
    margin: "5px 0 0",
    color: "#9ca3af",
    fontSize: "11px",
    lineHeight: 1.4,
  },

  emptyServices: {
    padding: "18px 12px",
    border: "1px dashed #d1d5db",
    borderRadius: "11px",
    textAlign: "center",
    backgroundColor: "#fafafa",
  },

  emptyServicesIcon: {
    width: "34px",
    height: "34px",
    margin: "0 auto 8px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
    color: "#94a3b8",
    fontSize: "14px",
  },

  emptyServicesText: {
    margin: 0,
    fontSize: "12px",
    fontWeight: 600,
    color: "#475569",
  },

  emptyServicesHelper: {
    display: "block",
    marginTop: "4px",
    fontSize: "10px",
    color: "#9ca3af",
  },

  servicesList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "10px",
  },

  serviceEditorCard: {
    width: "100%",
    border: "1px solid #e5e7eb",
    borderRadius: "11px",
    backgroundColor: "#ffffff",
    overflow: "hidden",
    boxSizing: "border-box",
  },

  serviceDropdownButton: {
    width: "100%",
    minHeight: "58px",
    padding: "9px 11px",
    border: "none",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    cursor: "pointer",
    textAlign: "left",
  },

  serviceDropdownInfo: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    minWidth: 0,
    flex: 1,
  },

  serviceDropdownIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: "13px",
  },

  serviceDropdownText: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    overflow: "hidden",
    fontSize: "12px",
    color: "#6b7280",
  },

  dropdownArrow: {
    flexShrink: 0,
    fontSize: "18px",
    color: "#6b7280",
    lineHeight: 1,
  },

  serviceEditorContent: {
    padding: "15px 12px 12px",
    borderTop: "1px solid #f1f5f9",
    backgroundColor: "#fafafa",
  },

  currencyInputWrapper: {
    width: "100%",
    height: "44px",
    display: "flex",
    alignItems: "center",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  currencyPrefix: {
    paddingLeft: "12px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#6b7280",
  },

  currencyInput: {
    flex: 1,
    width: "100%",
    height: "100%",
    border: "none",
    outline: "none",
    padding: "0 12px 0 7px",
    fontSize: "14px",
    color: "#111827",
    backgroundColor: "transparent",
    boxSizing: "border-box",
  },

  select: {
    width: "100%",
    height: "44px",
    padding: "0 12px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    outline: "none",
    fontSize: "14px",
    color: "#111827",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
    cursor: "pointer",
  },

  deleteServiceButton: {
    width: "100%",
    minHeight: "40px",
    border: "1px solid #fecaca",
    backgroundColor: "#ffffff",
    color: "#b91c1c",
    borderRadius: "9px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },

  addServiceButton: {
    width: "100%",
    minHeight: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    border: "1px dashed",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },

  addServiceIcon: {
    fontSize: "20px",
    fontWeight: 400,
    lineHeight: 1,
  },

  // ==========================================================
  // COR
  // ==========================================================

  colorRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  colorInput: {
    width: "48px",
    height: "40px",
    padding: "3px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#ffffff",
  },

  colorCode: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  },

  // ==========================================================
  // DICA
  // ==========================================================

  tip: {
    marginTop: "5px",
    padding: "13px",
    borderRadius: "10px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5e7eb",
  },

  tipStrong: {
    fontSize: "12px",
    color: "#374151",
  },

  tipText: {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "11px",
    lineHeight: 1.4,
  },

  // ==========================================================
  // PREVIEW
  // ==========================================================

  previewPanel: {
    width: "100%",
    minWidth: 0,
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "20px",
    boxSizing: "border-box",
  },

  previewPanelHeader: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "15px",
  },

  previewTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "#111827",
  },

  previewDescription: {
    margin: "5px 0 0",
    fontSize: "12px",
    color: "#9ca3af",
    lineHeight: 1.4,
  },

  previewBadge: {
    fontSize: "10px",
    color: "#6b7280",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "6px 8px",
    whiteSpace: "nowrap",
  },

  previewArea: {
    width: "100%",
    minWidth: 0,
    backgroundColor: "#eef2f7",
    borderRadius: "12px",
    padding: "20px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    overflow: "hidden",
  },

  // ==========================================================
  // CLIENTE
  // ==========================================================

  customerPage: {
    width: "100%",
    maxWidth: "520px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow:
      "0 10px 30px rgba(0, 0, 0, 0.10)",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  customerHeader: {
    width: "100%",
    padding: "32px 20px 28px",
    textAlign: "center",
    color: "#ffffff",
    boxSizing: "border-box",
  },

  customerLogo: {
    width: "76px",
    height: "76px",
    margin: "0 auto 13px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      "rgba(255,255,255,0.20)",
    border:
      "4px solid rgba(255,255,255,0.85)",
    fontSize: "27px",
    fontWeight: 800,
    overflow: "hidden",
    boxSizing: "border-box",
  },

  customerLogoImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  customerName: {
    margin: 0,
    fontSize: "23px",
    fontWeight: 800,
    wordBreak: "break-word",
  },

  customerDescription: {
    margin: "8px auto 0",
    maxWidth: "370px",
    fontSize: "13px",
    lineHeight: 1.5,
    color:
      "rgba(255,255,255,0.88)",
    wordBreak: "break-word",
  },

  customerContent: {
    padding: "20px",
    boxSizing: "border-box",
  },

  customerSection: {
    marginBottom: "23px",
  },

  sectionHeading: {
    margin: "0 0 12px",
    fontSize: "14px",
    fontWeight: 700,
    color: "#111827",
  },

  // ==========================================================
  // SERVIÇOS PREVIEW
  // ==========================================================

  previewServicesList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  service: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    borderRadius: "11px",
    boxSizing: "border-box",
    cursor: "pointer",
    textAlign: "left",
  },

  serviceInfo: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    minWidth: 0,
    flex: 1,
  },

  serviceIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: "14px",
  },

  serviceDetails: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },

  serviceName: {
    fontSize: "13px",
    color: "#111827",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  serviceDescription: {
    margin: "3px 0 0",
    fontSize: "11px",
    color: "#9ca3af",
  },

  servicePrice: {
    flexShrink: 0,
    fontSize: "13px",
    color: "#111827",
  },

  // ==========================================================
  // DATAS
  // ==========================================================

  dateGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "7px",
  },

  date: {
    minWidth: 0,
    padding: "9px 4px",
    borderRadius: "9px",
    border:
      "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "3px",
    boxSizing: "border-box",
    fontFamily: "inherit",
    cursor: "pointer",
  },

  // ==========================================================
  // HORÁRIOS
  // ==========================================================

  timeGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "7px",
  },

  time: {
    minWidth: 0,
    border:
      "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "9px 5px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },

  timeEmpty: {
    padding: "20px 12px",
    border:
      "1px dashed #d1d5db",
    borderRadius: "10px",
    backgroundColor: "#fafafa",
    textAlign: "center",
  },

  timeEmptyIcon: {
    display: "block",
    fontSize: "20px",
    marginBottom: "7px",
  },

  timeEmptyText: {
    margin: 0,
    fontSize: "12px",
    fontWeight: 600,
    color: "#6b7280",
  },

  timeEmptyHelper: {
    display: "block",
    marginTop: "4px",
    fontSize: "10px",
    color: "#9ca3af",
  },

  // ==========================================================
  // BOTÃO CLIENTE
  // ==========================================================

  customerButton: {
    width: "100%",
    height: "47px",
    border: "none",
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 700,
  },

  footerText: {
    margin: "12px 0 0",
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "10px",
  },

  // ==========================================================
  // PREVIEW VAZIO
  // ==========================================================

  emptyPreviewServices: {
    padding: "25px 15px",
    border:
      "1px dashed #d1d5db",
    borderRadius: "12px",
    textAlign: "center",
    backgroundColor: "#fafafa",
  },

  emptyPreviewIcon: {
    width: "40px",
    height: "40px",
    margin: "0 auto 10px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
  },

  emptyPreviewTitle: {
    margin: 0,
    fontSize: "13px",
    fontWeight: 700,
    color: "#374151",
  },

  emptyPreviewText: {
    display: "block",
    marginTop: "5px",
    fontSize: "11px",
    color: "#9ca3af",
  },
};

// ============================================================
// EXPORT
// ============================================================

export default PersonalizarPagina;