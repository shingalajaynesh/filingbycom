import express from "express";
import SitemapController from "./sitemap.controller.js";

const sitemapRouter = express.Router();

sitemapRouter.get("/sitemap.xml", SitemapController.getSitemap);
sitemapRouter.get("/image-sitemap.xml", SitemapController.getImageSitemap);
sitemapRouter.get("/robots.txt", SitemapController.getRobotsTxt);
sitemapRouter.get("/ads.txt", SitemapController.getAdsTxt);
sitemapRouter.get("/feed.xml", SitemapController.getRSSFeed);

export default sitemapRouter;
