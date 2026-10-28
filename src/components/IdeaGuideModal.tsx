import React from 'react';
import {
  X,
  Lightbulb,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Layers,
  Calendar,
  Award,
  BookOpen,
  FileText,
  CheckCircle2,
} from 'lucide-react';

interface IdeaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IdeaGuideModal: React.FC<IdeaGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                Conceito & Arquitetura da Ideia: UniDocs
              </h2>
              <p className="text-xs text-slate-300">
                A proposta definitiva para centralizar e desburocratizar a vida documental do universitário.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-8 overflow-y-auto max-h-[75vh]">
          
          {/* Section 1: The Pain Point */}
          <div>
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
              01. O Diagnóstico do Problema
            </span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              O Caos dos Documentos Acadêmicos na Universidade
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              O universitário moderno lida com dezenas de portais fragmentados: o sistema da faculdade (SIGA/Moodle/Canvas), grupos de WhatsApp da turma, e-mails de professores e pastas desorganizadas no celular. Quando surge uma oportunidade de estágio, a renovação do passe estudantil ou a colação de grau, o aluno perde horas procurando históricos, contratos com assinatura do coordenador e certificados de horas complementares.
            </p>
          </div>

          {/* Section 2: 5 Core Value Pillars */}
          <div>
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
              02. A Solução
            </span>
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Os 5 Pilares de Valor do UniDocs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>1. Taxonomia Acadêmica Nativa</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Não é apenas um Google Drive ou Dropbox: os documentos são indexados por Semestre Letivo (ex: 2026.1), Disciplina, Docente, CR e Código de Autenticação Digital.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>2. Guardião de Prazos e Validades</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Declarações de matrícula expiram em 30 ou 60 dias. O aplicativo monitora a validade dos atestados e avisa antes do vencimento para que o aluno renove a tempo.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>3. Hub de Horas Complementares</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Dashboard de progresso em tempo real (ex: 145/200h) dividido por categorias oficiais (Cursos, Congressos, Monitoria) com o certificado em PDF anexado a cada registro.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>4. Gerador de Dossiês Automatizados</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  A empresa de estágio pediu "Histórico + Matrícula + TCE"? O aluno clica em "Gerar Dossiê" e o app compila todos os arquivos com uma folha de rosto oficial num único pacote pronto.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 md:col-span-2">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  <span>5. IA Copiloto de Estudos & Secretaria</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Lê ementas e PDFs de aula para extrair datas de provas (P1, P2), resumir os tópicos mais importantes dos slides e gerar flashcards automáticos de memorização antes das avaliações.
                </p>
              </div>

            </div>
          </div>

          {/* Section 3: Architecture & Next Steps */}
          <div className="p-5 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-3">
            <span className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wider block">
              03. Próximos Passos de Integração no Campus
            </span>
            <ul className="text-xs text-indigo-950 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Conexão com Sistemas Acadêmicos:</strong> Sincronização via API com Moodle, Canvas, SIGAA ou portal do aluno para download automático de notas e atestados a cada semestre.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Validador de Assinatura Gov.br / ICP-Brasil:</strong> Leitor de carimbo digital embutido para validar se o PDF assinado pela coordenação é autêntico.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Carteira Estudantil Offline:</strong> Acesso instantâneo ao comprovante de matrícula na catraca da biblioteca e transporte mesmo sem conexão com a internet.
                </span>
              </li>
            </ul>
          </div>

          {/* Close button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
            >
              Explorar Protótipo do Aplicativo
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
