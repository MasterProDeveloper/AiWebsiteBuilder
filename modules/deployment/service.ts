export async function deploy(req: any, res: any) {

  const projectId = req.body.projectId;

  // simulate async deployment
  setTimeout(() => {
    console.log("Project deployed:", projectId);
  }, 3000);

  res.json({
    status: "deploying",
    url: `https://devforge-${projectId}.vercel.app`
  });
}
