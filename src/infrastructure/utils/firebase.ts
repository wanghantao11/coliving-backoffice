// This file contains all firebase util functions

export const parseImagePath = (url: string) => url.match(/(?<=2F).*(?=\?)/g)[0]
