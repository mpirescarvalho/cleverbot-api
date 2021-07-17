import DetectLanguage from "detectlanguage";

let lngDetector: DetectLanguage;

export function getLanguageDetector() {
  if (!lngDetector) {
    lngDetector = new DetectLanguage(process.env.DETECT_LANGUAGE_APIKEY)
  }

  return {
    async detect(text: string) {
      return await lngDetector.detectCode(text)
    }
  }
}
