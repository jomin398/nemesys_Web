export default function getUrlEncoded(sURL) {
    if (decodeURI(sURL) === sURL) return encodeURI(sURL)
    return getUrlEncoded(decodeURI(sURL))
}