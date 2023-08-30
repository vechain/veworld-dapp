//If err has nested field "error.message" then return it, otherwise return err
export const getErrorMessage = (err: unknown) => {
  if (typeof err === "object" && err !== null && "error" in err) {
    return (err as { error: { message: string } }).error.message
  } else if (typeof err === "object" && err !== null && "message" in err) {
    return (err as { message: string }).message
  } else {
    if (err instanceof Error) return err.message
    return JSON.stringify(err)
  }
}
