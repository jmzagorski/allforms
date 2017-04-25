module.exports = {
  "/api/": "/",
  "/forms/copy": "/forms",
  "/forms/data/lookups": "/lookups",
  "/forms/data/copy": "/formData",
  "/forms/data/snapshots": "/formData",
  "/forms/:id/data": "/forms/:id/formData",
  "/forms/data": "/formData",
  "/forms/profile/:memberId/:name": "/forms?name=:name&memberId=:memberId&_embed=elements&_embed=metadata",
  "/members/current": "/members?_limit=1",
  "/members/:id/forms/recent": "/members/:id/forms?_limit=10&_sort=lastEditInDays&_sort=asc",
  "/members/:id/forms/data/recent": "/members/:id/formData?limit=10&_sort=saved&_sort=asc&_expand=form"
}
