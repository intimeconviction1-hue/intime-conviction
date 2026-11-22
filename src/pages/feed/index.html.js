// L'ancien WordPress publiait son flux à /feed/. Les lecteurs RSS abonnés
// depuis des années interrogent toujours cette adresse, qui répondait 404 :
// ils ne recevaient plus rien. GitHub Pages ne sait ni rediriger un flux ni
// choisir le type servi ; on sert donc le même flux, en XML, à l'adresse que
// ces lecteurs connaissent (ils lisent le contenu, pas l'en-tête).
export { GET } from '../feed.xml.js';
