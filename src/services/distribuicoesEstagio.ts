import { supabase } from "../lib/supabase";

type DistribuirInscricaoParams = {
  inscricaoId: number;
  edicaoEstagioId: number;
  professorId?: string | null;
  orientadorId?: string | null;
  professorResponsavelId?: string | null;
  distribuidoPor: "admin" | "professor_responsavel";
  utilizadorDistribuicaoId: string;
  maxProfessor?: number;
  maxOrientador?: number;
  forcarAlteracao?: boolean;
};

export async function garantirEquipaEstagio({
  edicaoEstagioId,
  professorId,
  orientadorId,
  maxProfessor = 8,
  maxOrientador = 8,
}: {
  edicaoEstagioId: number;
  professorId?: string | null;
  orientadorId?: string | null;
  maxProfessor?: number;
  maxOrientador?: number;
}) {
  if (professorId) {
    const { error: profError } = await supabase
      .from("professores_estagio")
      .upsert(
        {
          edicao_estagio_id: edicaoEstagioId,
          professor_id: professorId,
          max_alunos: maxProfessor,
        },
        {
          onConflict: "edicao_estagio_id,professor_id",
        }
      );

    if (profError) {
      return {
        ok: false,
        error: profError.message,
      };
    }
  }

  if (orientadorId) {
    const { error: orientError } = await supabase
      .from("orientadores_estagio")
      .upsert(
        {
          edicao_estagio_id: edicaoEstagioId,
          orientador_id: orientadorId,
          max_alunos: maxOrientador,
        },
        {
          onConflict: "edicao_estagio_id,orientador_id",
        }
      );

    if (orientError) {
      return {
        ok: false,
        error: orientError.message,
      };
    }
  }

  return {
    ok: true,
    error: null,
  };
}

export async function distribuirInscricaoEstagio({
  inscricaoId,
  edicaoEstagioId,
  professorId,
  orientadorId,
  professorResponsavelId,
  distribuidoPor,
  utilizadorDistribuicaoId,
  maxProfessor = 8,
  maxOrientador = 8,
  forcarAlteracao = false,
}: DistribuirInscricaoParams) {
  const { data: inscricaoAtual, error: erroBuscar } = await supabase
    .from("inscricoes_estagio")
    .select(
      `
      id,
      professor_id,
      orientador_id,
      professor_responsavel_id,
      distribuido_por
    `
    )
    .eq("id", inscricaoId)
    .single();

  if (erroBuscar) {
    return {
      ok: false,
      tipo: "erro",
      message: "Não foi possível verificar a inscrição atual.",
    };
  }

  const jaTemDistribuicao =
    inscricaoAtual?.professor_id || inscricaoAtual?.orientador_id;

  if (jaTemDistribuicao && !forcarAlteracao) {
    return {
      ok: false,
      tipo: "ja_distribuido",
      message:
        "Este aluno já tem professor ou orientador associado. Revê antes de alterar.",
      inscricaoAtual,
    };
  }

  const equipa = await garantirEquipaEstagio({
    edicaoEstagioId,
    professorId,
    orientadorId,
    maxProfessor,
    maxOrientador,
  });

  if (!equipa.ok) {
    return {
      ok: false,
      tipo: "erro",
      message: equipa.error || "Não foi possível criar a equipa do estágio.",
    };
  }

  const { error: erroAtualizar } = await supabase
    .from("inscricoes_estagio")
    .update({
      professor_id: professorId || null,
      orientador_id: orientadorId || null,
      professor_responsavel_id: professorResponsavelId || null,
      estado: "aprovado",
      estado_estagio: "em_curso",
      distribuido_por: distribuidoPor,
      data_distribuicao: new Date().toISOString(),
      utilizador_distribuicao_id: utilizadorDistribuicaoId,
    })
    .eq("id", inscricaoId);

  if (erroAtualizar) {
    return {
      ok: false,
      tipo: "erro",
      message: erroAtualizar.message,
    };
  }

  return {
    ok: true,
    tipo: "sucesso",
    message: "Distribuição guardada com sucesso.",
  };
}