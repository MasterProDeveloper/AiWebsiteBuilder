import { AIRouter } from "../../../../packages/ai-core/router";

const router = new AIRouter();

export async function generate(req: any, res: any) {

  const { model, prompt } = req.body;

  const result = await router.generate({
    userId: req.user?.id,
    workspaceId: req.body.workspaceId,
    model,
    prompt
  });

  res.json(result);
}
