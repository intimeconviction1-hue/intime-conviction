"""Import conservateur du SRJ. Aucune attribution à partir d'une simple mention de ville."""
import csv, json, math, pathlib, re, subprocess, unicodedata, hashlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
src=ROOT/'.cache/justice/structures-avril2026.csv'
out=ROOT/'.cache/justice/structures-justice.json'
source='https://www.data.gouv.fr/api/1/datasets/r/9204b2e2-9f20-4a36-86ce-83493303d987'
territoires=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {TERRITOIRES} from './src/lib/geographie-judiciaire.mjs';console.log(JSON.stringify(TERRITOIRES))"],cwd=ROOT,text=True))
def norm(s):
    return re.sub(r'[^a-z0-9]','',unicodedata.normalize('NFKD',s.lower()).encode('ascii','ignore').decode())
def num(s):
    return float(s.strip().replace(',','.'))
def dep(code):
    return code[:3] if code.startswith(('97','98')) else code[:2].upper()
bounds={'971':(-62,-60,15,17),'972':(-62,-60,14,16),'973':(-55,-51,2,6),'974':(55,56,-22,-20),'976':(44,46,-14,-12),'975':(-57,-55,46,48),'986':(-179,-175,-15,-12),'987':(-151,-148,-19,-16),'988':(165,168,-24,-20)}
required={'TYPE','CODE_INSEE','CODE_ORIG','NUM','NOM_ETABLISSEMENT','NUMÉRO_ET_LIBELLÉ_VOIE','LIEU_DIT','CODE_POSTAL','LIGNE_D_ACHEMINEMENT','PAYS_OU_DÉNOMINATION_TOM_COM','COORDONNÉES_X','COORDONNÉES_Y'}
records=[]; rejected=[]; seen=set(); candidates=0
with src.open(encoding='utf-8-sig',newline='') as f:
    reader=csv.DictReader(f,delimiter=';')
    if not required.issubset(reader.fieldnames or []): raise ValueError('Schéma officiel incomplet')
    for row in reader:
        typ=row['TYPE'].strip().upper()
        if typ not in ('CASS','CCD'): continue
        candidates+=1
        code=row['CODE_INSEE'].strip()
        name=row['NOM_ETABLISSEMENT'].strip()
        city=row['LIGNE_D_ACHEMINEMENT'].strip()
        city=re.sub(r'\bCEDEX\b.*$','',city,flags=re.I).strip()
        city=re.sub(r'\s+\d+$','',city).strip()
        aliases={'62765':('stomer','saintomer'),'22278':('stbrieuc','saintbrieuc'),'42218':('stetienne','saintetienne'),'91228':('evry','evrycourcouronnes'),'97411':('stdenis','saintdenis'),'97502':('stpierreetmiquelon','saintpierre')}
        city_key=norm(city)
        alias=aliases.get(code)
        if alias and city_key==alias[0]: city_key=alias[1]
        matches=[t for t in territoires if t['code']==dep(code) and norm(t['ville'])==city_key]
        # Plusieurs juridictions dans une même ville restent distinctes par leur identifiant SRJ.
        key=row['CODE_ORIG'].strip()+':'+row['NUM'].strip()
        try:
            if len(matches)!=1: raise ValueError('ville non rapprochée')
            if not all(key.split(':')) or key in seen: raise ValueError('identifiant manquant ou dupliqué')
            lon=num(row['COORDONNÉES_X']);lat=num(row['COORDONNÉES_Y'])
            west,east,south,north=bounds.get(dep(code),(-6,10,41,52))
            if not all(map(math.isfinite,(lon,lat))) or not(west<=lon<=east and south<=lat<=north): raise ValueError('coordonnées hors enveloppe géographique')
            street=row['NUMÉRO_ET_LIBELLÉ_VOIE'].strip()
            postal=row['CODE_POSTAL'].strip()
            if not street or not re.fullmatch(r'\d{5}',postal) or not name: raise ValueError('adresse ou nom incomplet')
            record={'idSRJ':key,'implantation':matches[0]['implantation'],'codeINSEE':code,'nom':name,'nature':'Tribunal criminel' if code=='97502' and typ=='CASS' else ('Cour d’assises' if typ=='CASS' else 'Cour criminelle départementale'),'typeSRJ':typ,'adresse':', '.join(x for x in [street,row['LIEU_DIT'].strip(),postal+' '+row['LIGNE_D_ACHEMINEMENT'].strip()] if x),'lat':lat,'lon':lon,'precision':'coordonnées du référentiel institutionnel','source':source}
            records.append(record);seen.add(key)
        except (ValueError,TypeError) as e:
            rejected.append({'idSRJ':key,'type':typ,'codeINSEE':code,'nom':name,'ville':city,'x':row['COORDONNÉES_X'],'y':row['COORDONNÉES_Y'],'motif':str(e)})
if not records: raise ValueError('Aucune structure valide : vérifier la projection et le rapprochement')
records.sort(key=lambda r:(r['implantation'],r['idSRJ']))
result={'schema':1,'source':source,'dateSource':'2026-04-16','sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'structures':records}
out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
report={'candidats':candidates,'structuresValides':len(records),'implantations':len({r['implantation'] for r in records}),'rejets':rejected}
(out.parent/'rapport-import.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))
print('JUSTICE_SNAPSHOT_BEGIN')
print(json.dumps(result,ensure_ascii=False,separators=(',',':')))
print('JUSTICE_SNAPSHOT_END')
