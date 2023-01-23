import { db, endpoint } from "../../configs/altogic";

const pixelService = {
  create(body) {
    return endpoint.post("/pixel", body);
  },
  getBySlug(slug) {
    return db.model("pixel_arts").filter(`slug == "${slug}"`).getSingle();
  },
  getConnectionBySlug(pixelSlug, userId) {
    return db
      .model("pixel_user_connections")
      .filter(`pixelSlug == "${pixelSlug}" && user == "${userId}"`)
      .lookup({ field: "pixelArt" })
      .getSingle();
  },
  getRole(pixelSlug) {
    return endpoint.get("/pixel/role", { pixelSlug });
  },
  draw(slug, pallette) {
    return db.model("pixel_arts").filter(`slug == "${slug}"`).updateFields({
      field: "pallette",
      updateType: "set",
      value: pallette,
    });
  },
  getUserArts({ userSlug, searchText, page = 1, limit = 12 }) {
    return db
      .model("pixel_user_connections")
      .filter(`userSlug == "${userSlug}"`)
      .lookup({ field: "pixelArt" })
      .page(page)
      .limit(limit)
      .get(true);
  },
  getGlobalPixels({ searchText, page = 1, limit = 12 }) {
    return db
      .model("pixel_arts")
      .filter(searchText ? `INCLUDES(name, '${searchText}')` : "")
      .sort("updatedAt", "desc")
      .page(page)
      .limit(limit)
      .get(true);
  },
  sendInvite(email, pixelId) {
    return endpoint.post("/invitation", { email, pixelId });
  },
  joinPixel(email, pixelId) {
    return endpoint.post("/invitation/join", { email, pixelId });
  },
  getPixelDrawers({ pixelSlug, searchText, page = 1, limit = 10 }) {
    return db
      .model("pixel_user_connections")
      .filter(
        searchText
          ? `pixelSlug == "${pixelSlug}" && INCLUDES(userName, '${searchText}')`
          : `pixelSlug == "${pixelSlug}"`
      )
      .lookup({ field: "user" })
      .page(page)
      .limit(limit)
      .get(true);
  },
  updatePixelName(pixelId, pixelName) {
    return endpoint.put("/pixel/name", { pixelId, pixelName });
  },
  removePixelArt(pixelId) {
    return endpoint.delete("/pixel", { pixelId });
  },
  deleteMember(pixelId, memberId) {
    return endpoint.delete("/pixel/member", { pixelId, memberId });
  },
  updatePixelPicture(pixelSlug, publicPath) {
    return endpoint.put("/pixel/picture", { pixelSlug, publicPath });
  },
  replacePicture(file, pixelSlug) {
    return endpoint.put("/pixel/replacePicture", file, {
      pixelSlug,
    });
  },
};

export default pixelService;
