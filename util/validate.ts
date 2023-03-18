export function validateTitle(title: string) {
  if (title.length < 1) {
    return true
  } else {
    return false
  }
}

export function validateBody(body: string) {
  if (body.length < 30) {
    return true
  } else {
    return false
  }
}
