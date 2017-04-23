module.exports = {
  "/api/": "/",
  "/forms/data/lookups": "/lookups",
  "/forms/data/copy": "/formData",
  "/forms/data/snapshots": "/formData",
  "/forms/:id/data": "/forms/:id/formData",
  "/forms/data": "/formData",
  "/members/current": "/members?_limit=1",
  "/forms/profile/:memberId/:name": "/forms?name=:name&memberId=:memberId&_embed=elements&_embed=metadata"
}
