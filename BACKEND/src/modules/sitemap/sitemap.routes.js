import express from "express";
import SitemapController from "./sitemap.controller.js";

const sitemapRouter = express.Router();

sitemapRouter.get("/sitemap.xml", SitemapController.getSitemap);

export default sitemapRouter;
