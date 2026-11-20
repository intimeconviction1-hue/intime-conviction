// Une publication programmée ne doit pas apparaître dans les sélections
// éditoriales avant sa date, ni pendant sa vérification.
export function articleVisible(data, maintenant = Date.now()) {
  const date = data?.date;
  return data?.verificationEnCours !== true
    && date instanceof Date
    && Number.isFinite(date.getTime())
    && date.getTime() <= maintenant;
}
