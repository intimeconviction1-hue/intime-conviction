// Les mots-clés sont établis par la rédaction, dans les métadonnées de
// l'article original. Pas de rapprochement automatique par simple vocabulaire.
const normaliser = s => String(s ?? '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('fr').replace(/[’‘]/g, "'")
  .replace(/[^a-z0-9]+/g, ' ').trim();

const referencesParArticle = {
  '/paris-arnould-depardieu-renvoi-partiel-deux-dates/11/2026/': ['1245397','2847161','68a9679a92161ef5b77027aee3fd988a','gerard-depardieu-face-trial-rape-his-lawyer-says-2026-11-26'],
  '/mons-falzone-indemnisation-solidarite-passager/11/2026/': ['CBMi1gJBVV95cUxOeUtSbjFRajFIZEF2c2phbEQtZVcwdDJNRjZYMDVXclVEWmlIWVpWcXZ5aGh4WG5xWGgzY','CBMirAFBVV95cUxOVVNxbGliaFFkSVc1bUVyM0YzZ0VFc3YyYXNVblN1TjhTUXlQVWRSYmZMeUo5UV9lX3dGO','proces-falzone-debut-des-audiences-du-volet-civil/30582'],
  '/roanne-victor-marques-legitime-defense/11/2026/': ['dix-centimetres-de-lame-dans-le-cerveau-meurtre-ou-legitime-defense', 'CBMiwgFBVV95cUxORmRrQ0NDeW96LUpvVXhrOTJWeFRWSkYyWG1MdExZOUZZdjhVS3VYeF'],
  '/charente-assises-romain-runel-ouverture-proces/11/2026/': ["CBMi7gFBVV95cUxQYkhsVl9SQU9zX0dsLVZ4MGdiR1hPR2l6Wkl0aWg0ZTFQOHRGTHZhdzBycEFsWENTRnRu", "CBMiigJBVV95cUxQQmR0dFM0cFNudXdrQ0JfalVFcldWcXhpZ084bHZkYVZST05UczdVMTdiWEY0Yk1URW","CBMioAJBVV95cUxQVEdESmd3V0V2OUt3S1VhQUpYamhib3FMeTJ6WkhnY0FsMWYwc2hkeVpWVENyM3FaQk","CBMi9gFBVV95cUxPaDd2LUFBM1UtYml1MzREZ2w3eXpwSXBwWV9ETmxRVU5MbHNHQkpFcHNzeFlYTE1BNl","CBMi2wFBVV95cUxQZk1BODc3QmFHaVp0d0pJUktTU1dLcTY5cENVc2NiQm45WXZVVDBqMWd6bnlaYVhZcF"],
  '/paris-emilie-konig-proces-assises/11/2026/': ["CBMiswFBVV95cUxPV28ySndBMERYU2Y1MGtZVGRXSjZRaFRwQUZldzBhZFQ5NmMtY1p6dzFSR1Q5","CBMixwFBVV95cUxNXy1oTExZeE02LVoxdk8yeVRFV1dSYkxnb3lLTUtXZC16b3ZWTzN2b1pUTVRD","CBMiugFBVV95cUxOQjdmTnhid2hBc1lBbFlualk2T0ZUVEtwMlZfSWVBR2tqSFBsTnpmQmgxWmct","CBMiggJBVV95cUxNcVgwNjdYb3VOSlFoMzJXRDh2OFc2eU4yQ21TWl92WEFjVnp6Y2dFTTUzNHpk","CBMi9AFBVV95cUxPN2dNMmJ4MWlXdkRlSHpfa2x0enoxeFlUbEFKZXc2WmFDUjRvN0pEUUxrcUtt","CBMiowFBVV95cUxPYmY3WEtld3ZRWVVUaUZMVkg5VUFQbUdFY3hyc1JYZkVQX2JTSEEyTTNsTTJZ","CBMi3gFBVV95cUxOTnViSldoX2pIcW9hLUFQMkhOXzJSZ0oyazRpOEhMMGpLVzctdlhxek1vdHpS","CBMipgFBVV95cUxOZmRZRjEyZUhmQUlfNWFEUUp0R1lTYk5kbG9QekFqM05SYThTaDlGUmRIZFBk","CBMi0wFBVV95cUxPaFVaV1JwdldwVXJoRVNKSk1VUFd6anBlMHd4eDVTTElqM2tPTUY1TmJzUHJi","CBMi3wFBVV95cUxOMHNWcmdqZ3FXVEFFQXRycWRTRS1mNUJmTklta0tsbEtqVFhQVkt4MnRYN3F1","CBMi5wFBVV95cUxPRXVsb3FTNVAteHdJM3ZLcnM0cm5MZDRLdDVJeFJPMXpPZWdQRU4zT20xazBm","CBMivAFBVV95cUxQbzhrejZMaVNZVU9XSk1vQ2l6TU9FdWZVNlRvUVdTS1llQ3BET1MxZWdCQU1I","CBMivAFBVV95cUxPMnozMjBaTzJoQTA1V3VPTUliWlhWUzhIZE9SRXU3NW5ZbWl0MkIyMFdqZ0Ny","CBMirAJBVV95cUxNa2J3azlyNGdXNGdvWEgxandLYTJENmRnd3ZsQ3dsMjZJcGowLWpSVjZaRmdQ","F3PMCUSMEJGJDCHH5DOQOBVK4M","6815463_3224","2847106"],
  '/basse-terre-nathalie-caux-autopsie-percheron/11/2026/': ['CBMi3gFBVV95cUxQUjRDTjVRejY5ZE5JcFg3UmlZUFBjdnNnLURKcjFlX2lCczlvQmJvLUl5ZG9NSXkwWG92UzFud2Na', 'CBMivwFBVV95cUxNWEdmMndObVNOU3Rnd3pSZ1FMcUUtX2doZUhDM3dZR3NUSkUxc2VpOUJUVk5ZRi1y', 'Thierry-Percheron-condamne-20-ans-de-reclusion-criminelle', "CBMivwFBVV95cUxNSzNWN1dod1Y4QVhNT0ozMWpTd3N1XzdyQ3Z5Q3U2WWJ2dEJCd201R0dZSXV3Q0ZkSF96eTNj","1761587.html"],
  '/bruxelles-starzomski-sugar-provocation-verdict/11/2026/': ['ZVPIOS4WKFGQTIX65UMPKUCZ5Y'],
  '/montpellier-morcillo-acquittement-montasinos/11/2026/': ["CBMi6AFBVV95cUxQdUhHeE1lVXdYX2FWRjI3eEh1QVYtWXB4YzEyRktUUnNnSlBncFA2TGxERU1hN1JvTz", '13670805.php', 'JEM5BWNCO5FCLMRGZSVYLGP6PM.php', 'CBMimwJBVV95cUxPY2VBTHEzTzI5NlJZUnpLUFZueVZPd1RqalFLVEJXd3IyOXFSdVdKRDJHM2F5RzBxNTFuQzlj'],
  '/reims-raphael-narcisse-verdict-celestin/11/2026/': ["CBMixgFBVV95cUxQYkFhZVVFTnNudXlLZ0hCZTJZYkRvWlBpRU1WSkRJUWs2NjlPLS1vMzJFVWg3bFEyTG1DWDc3","CBMitwFBVV95cUxOR3FiMjJjUDJGZFJjR0ZYTW5jTnI1YXlqUy13bk1mSEtyckVDejdEbGw1RVkyTWUxejREZE5R","842435","3455813.html"],
  '/papeete-makemo-jacques-t-audience-coup-mortel/11/2026/': ['CBMizwFBVV95cUxOSWFEdS1zOGJTQjcyRjc2WmlNR0hhSG1QOTUzSXZKN3BWVnFOQ2VJX284VDlUS2JHLWFVeTRfd0'],
  '/bruyeres-gilbert-jacob-proces-jimmy-hariot/11/2026/': ['CBMi-wFBVV95cUxQNXJZdjVaMkVIbGxFdHpBdEFaSkhDOTl4d2RkMTVLVUpoeWpNb1R3RDRpeEJQWHgyay12Ujlqcm',"CBMi3AFBVV95cUxPYzUxRVVLTFByQ0JRYkxGcGZPZlZTMUJSS3BTUnlJVkxjcG9JWDlkVGx1NW9mMHl5","CBMiekFVX3lxTE5aR3RkOU5fa1hpaEdtWGhqMVg1SWV1NkNiaGxzaFFxUTZqU0E3OEtrM3pvekdqVnRj","CBMihgFBVV95cUxQZDI2b29pTWk3MVduaXBCOHd0blhpckJFcDRPMUJMaU9XS1c4MXJSTjM5emZ4MVVX","CBMisgFBVV95cUxNQjFkOFladnlGMkFzV2JkRURpQVA2LWVPeFBrSnZ2bFdQZzFIRjRpTGphdjFqbDc0"],
  '/grasse-nora-mike-furlad-trente-ans-intention-contestee/11/2026/': [
    '10765242',
    'CBMi1AJBVV95cUxQdlZlVTBveU9TM0szanZPWHRpMERmLTk3VWREUFdlUnFXSTliNjBCY3c0ekdwdnZSaHZ4dzd0',
  ],
  '/puy-en-velay-hotel-tentative-meurtre-verdict/11/2026/': [
    '/cour-d-assises-elle-n-a-pas-voulu-l-envoyer-au-paradis-mais-lui-oter-la-vie',
    'CBMizAFBVV95cUxNT052NjB1YjJRWi16MTY0akc0ZkVMc1E1dWhLWFpSNzBOM1VTZ01rNzlzUFEtZldqVXdVZ2NKMmtDemc2',
  ],
  '/chahinez-daoud-boutaa-perigueux-discernement/11/2026/': [
    'CBMisgFBVV95cUxPR0dRRTBMUGtjalZBS3V1Q0NpQXk4dV93U3d6S2pleFNYWkVOVm1iQTl1U2pFUWctckpuNm5Tc1BwMmNM', 
    'CBMi2AFBVV95cUxQWUhqcGw1UG91NnZHX3lxNU80cVRpaUVTdk9ORl9XaThPQng0bnBNcjZsR3kzSXJwUFRIMWRMZzdERDNYQ3J4',
    '31621270.php',
  ],
  '/samia-mimoun-maurepas-legitime-defense-verdict/11/2026/': [
    'GJ2QSSLEQNDLPIRVKCWLY2HJXI', 'PMUFYGSGGBFGLFYCVFWZ2SPTUA',
    'WCPB5OXDJNGZNBYIG2T5TEX4SE', 'UQYASSHSZVACJLVFBXKEEJ56RE',
    'CBMiiwFBVV95cUxQelVZenJZWFZEa1Z2TzRmOEluZE5xZ2x1QjVmaVdfcDJPbWpGbEkxN3VXeGhkSDFfRFdRRUxtc3ZJRW1yWFB4WkpnT2NNM2g1cFFvYlo5MFVPY0xJZnRaOEVvRTRvNHRabEtOYnlEU2R4cG1SeTFub1hPeXZhc2taMG5TOEN4ZXZpTkxZ',
  ],
  '/piaget-le-braqueur-au-borsalino-revient-devant-les-assises/11/2026/': [
    '2846782', 'TYNURC4T25HVXLJ2B5BGT6Y7AQ',
    '/braquage-de-la-joaillerie-piaget-en-2023-l-homme-au-borsalino-condamne-a-15-ans-de-reclusion',
  ],
  '/yordan-arron-basse-terre-desistement-appel/11/2026/': [
    '/Assises-de-Basse-Terre-Yordan-Arron-se-desiste-de-son-appel',
    '/Assises-en-appel-Yordan-Arron-rejuge-pour-la-mort-de-son-nourrisson',
  ],
  '/karen-baldi-proces-chambery-protection-premeditation/11/2026/': ["CBMi_AFBVV95cUxPVnVxZmQ2ZUZsT3VPeUtkOGZ3X09Wbkg2bXRhOVlTLVJZLXliS05DbmxicTV1bjVidGQt","CBMikwJBVV95cUxPbXEzTVRORlhLOW5hZFEzVUdaWmFLbXZYaG8xbV83VTE4bk9ZWjFSQmFXS0szZzhTRXhB", "CBMiyAFBVV95cUxNX3VEaklzWWR3eF9oTkNNZXZpVjJPNF8xazc5TmpLbm9WR1ZyQ2VuV3hOZTIteFpiX3", 
    '3452391.html', '2846785', '10762754',
    'CBMisAJBVV95cUxQLTRsb1hpamxiay02RjJqeXp3MkhEUlcxdExOWEtqRnlYTVI1bk5JdkdEMFNQNERwWWFxbEpjaUplUUE1d3NM',
  ],
  '/camille-paul-basse-terre-enregistrement-verdict/11/2026/': [
    '/meurtre-d-une-strasbourgeoise-en-2024-30-ans-de-reclusion',
    '/Pascal-Velayoudom-reconnu-coupable-du-viol-et-du-meurtre-de-Camille-Paul',
  ],
  '/duchere-lyon-proces-absence-ben-addi/11/2026/': [
    '65053768.html', '/article/154937/',
    '2846748', '2846764', 'VN-202611230268.html',
    'CBMixgFBVV95cUxPZHhBVFhTblNNWFlDYWw3QlFpdTAxeFVjMTg4Mm55',
    'CBMiygJBVV95cUxOQTJhckc0NjhaYldWWF8ycm5fMzdidWdPU0g3TFFM',
    'CBMiyAFBVV95cUxNbVJ0bWJLU0U2RFZUcFZYWXNqSFhwWTlBVkZGZm9q',
  ],
  '/jean-paul-benjamin-bobigny-images-legitime-defense/11/2026/': [
    'W4ZBVATMNNB5ROGARNH62RUAAU',
    '65UFEFWRAJBM3FZOS23TFSTTPU',
    'E2T22M2CDVFENHCL3WTSCAROVA',
    'afa1165b1b31a30482433d932af75f3b',
  ],
  '/evry-meurtre-sabine-appel-au-17/11/2026/': ['8745284e-e4e9-11f1-b9ed-164c427aef07'],
  '/nahel-merzouk-versailles-intention-du-tir/11/2026/': [
    'CBMi1gFBVV95cUxONm9jMWtFN1JHSUoxY0pMQ0Z0cUVFVDYxRVh0Sk9seHI0YXZHY0hm',
    'CBMiwgFBVV95cUxQVDA0MFRyNnNwa0FOTnlVT2hfNUpoTHMtZUxIRURSb3lDOEky',
    'CBMizwFBVV95cUxNZlliUGxnXzVMUTJTM0pTWURHWnRqNTIwLTJYUDRRQTAxcWxh',
    'CBMi6AFBVV95cUxNell5R1FkcEZiWTZQQXdtcVJzdHRIc1JkTTFyYkNTVkYw',
    'CBMiugFBVV95cUxNS01OUk5welhERmtjZXk1VzhwRjlSSnRMVzk3cjFaM0pCT2NB',
    'CBMivAFBVV95cUxQcXVPVnNCdGVNdGRJSWJLVk90azNQd3oycWJFcWE5QjdDemVpQjhtX2FNYXN0YmpsUTVj',
    'CBMiywFBVV95cUxOUHIyWERWMmNmT0k5NGFPNjJscF8zTEIwalNoTEtrTDFYWGJMdjcwVGNwZnNkSkxQTTFE',
    'CBMiyAFBVV95cUxPN2ZtRFdMUkZ4aHhMZ2tGM3IwQ2JGdk9udFBlb1NaSkxpVldRcUJwVUR3eTROOW5qRkx5',
    'CBMilAJBVV95cUxNeDJMSU5yd1lhak1FNVlhdjBnSkRJWlY2UkJEVVVQT3J5cEJKSU1hRFdDLWpLM2MyQk51',
    'CBMipAFBVV95cUxQWDl5Wk1TMU0zVHB1ZXdzVGRlblE4aktyeks0cHljdkYzV0RpM3d5d0hkZmhYem1DSVVG',
    'CBMixgFBVV95cUxNZ2JTZFVuNGNVUVFlMC12RmVPWWxzUkcxdmMxaWdUeURiVVZ1c2pTNmtyLUJBSnpkZFBl',
    'CBMijwJBVV95cUxNaUtfODl4TDJqaV9uU3l6MHRIRjl2bUZwRk1WcU01el8xSW1EV2s0VVpOUDNQVkFjUEJn',
    'CBMi8gFBVV95cUxPdkVld0RHTk1xbS1XMVloMkVneXpLVUlZZThaWGdEc0l1Y2lSdHJVNUZIYTNiRjJ6SFU0',
    'CBMiwAFBVV95cUxQMjJpVFZqWGt6QzdBcGNPRDBTeWk3MDFXRUtVMk1UQThrSDBBU2ZlU3NRQ09samNNRjgx',
    'CBMizwFBVV95cUxObnc4UGVtTko0ay1mOFptdjJTUlhMSUhwNi1fOHgwZkVFWTEweGg5c2p4S3JRZk9pblA0',
    'CBMi7gFBVV95cUxQblR1VTBrUDg2c3NmQ0UxUmE0R01HZEgtYTVYSmZXTU1yc1VSckZCNkhOVGtiVW5RNkdN',
    'CBMiXEFVX3lxTE1XekxNdWphT0VqRWh1YVcyRmplRjcxZXI1dFpmT2Z2dElRLVJPekhMZGRQWjRPVjBHcUJa',
    'CBMijgFBVV95cUxQMkpnNlRIY2RRSU1aY0N3ckZaSENqU0w2aWZYdzVGbDN2OWJ4bWF3bWhBdUYwNUZVN0ln',
    'CBMitgFBVV95cUxPOFZkSU5jQjhoSldUNjFjX0NXaVBzam5mZEIzcEQxVS1lT1pQLTJ6TEktbzVNMnFQSGhG',
    'CBMixgFBVV95cUxPVVlxc054STlkWDM0TGRpNVpkZWNPcGppZWs1Sl91MzEwS011N0ZxODUzb01qOWlHeXJ0',
    'CBMikAFBVV95cUxPb1JqSnFfQnZVYXZtRVg3YV9XR1AtSFVBQ2Y0RHlyVW00MFh4eTdGdEYxNndoS0Z6MFZH',
    'CBMirwFBVV95cUxQVll6V0xfa3NWdUphdmxHdV9MME9rYjd0U2Q3LXprOHA4MkVaSGdhT1MzdVBuOFM2dWY1',
    'CBMi7gJBVV95cUxNUnExVnVBVTdTZnFuODNXRmhyR2FtRUhqb1ktVm1pbFhPU19EM01hLUx5MTVlTmM5Qmtz',
    'justice-se-prononcera-mardi-10766331',
    '2846832','8295785.html','6814726_3224.html','AD-202611240212.html','HLTCW73RNRDUPJOWTA4ET4ZAEY','7900699786','4265284','ee79b4ac-e7d8-11f1-9b33-2f81462d3339',
    'CBMi4wFBVV95cUxPX1NFTXVTLXV5NVV3SW1wWEtFSFpOdDR5b05IU0prbnVCWGhoZjRnVi16d1NF',
    'CBMiqAFBVV95cUxNTTN6NUpWa2FIYWRLWGI2LTVjRW4tWXpWMm9qNGdCYk5uczRvSGx0TXZt',
    'CBMi9wFBVV95cUxOd1E3V2hVcl9LRTBUdHJVcVVFRmZ6MktIUE1rNjctaUVyRU13',
    'CBMiggFBVV95cUxOdEtFMXVSakhYdWNndVU0cnVPSV9fUC0zbGNBeTlhUGRtNlRX',
    '225080659812914/mort-de-nahel',
    'renvoi-du-policier-pour-meurtre-13665529.php',
  ],
  '/proces-sollacaro-et-tout-recommence-aux-assises/11/2026/': ['8368231'],
};

export function presseSansRedite(references, articlesEnUne) {
  const sujets = [...new Set(articlesEnUne.flatMap(article =>
    Array.isArray(article?.data?.sujetsPresse) ? article.data.sujetsPresse : []
  ).map(normaliser).filter(s => s.length >= 5))];
  const identifiants = articlesEnUne.flatMap(article => referencesParArticle[article?.data?.chemin] ?? []);
  if (!sujets.length && !identifiants.length) return references;
  return references.filter(reference => {
    if (identifiants.some(id => String(reference.lien ?? '').includes(id))) return false;
    const titre = ' ' + normaliser(reference.titre) + ' ';
    return !sujets.some(sujet => titre.includes(' ' + sujet + ' '));
  });
}
