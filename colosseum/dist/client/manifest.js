export async function getStreamInfo(manifestUrl) {
    return parseStreamInfo(await (await fetch(manifestUrl)).text());
}
function parseStreamInfo(xml) {
    const manifest = new DOMParser().parseFromString(xml, "application/xml");
    const reprNode = manifest.querySelector("Representation");
    const mimeType = reprNode?.getAttribute("mimeType") || "";
    const codecs = reprNode?.getAttribute("codecs") || "";
    const periodNode = manifest.querySelector("Period");
    const duration = parseDuration(periodNode?.getAttribute("duration") || "");
    const segTmplNode = reprNode?.querySelector("SegmentTemplate");
    const segNameTmpl = segTmplNode?.getAttribute("media") || "";
    const startNumber = Number(segTmplNode?.getAttribute("startNumber")) || 1;
    const initSegName = segTmplNode?.getAttribute("initialization") || "";
    const segDuration = Number(segTmplNode?.getAttribute("duration")) /
        Number(segTmplNode?.getAttribute("timescale"));
    return {
        mimeType,
        codecs,
        duration,
        initSegName,
        segNameTmpl,
        startNumber,
        segDuration,
    };
}
function parseDuration(s) {
    const rDays = `(?<days>[\\d.]+)D`;
    const rHours = `(${rDays})?(?<hours>[\\d.]+)H`;
    const rMinutes = `(${rHours})?(?<minutes>[\\d.]+)M`;
    const rSeconds = `(${rMinutes})?(?<seconds>[\\d.]+)S`;
    const match = s.match(new RegExp(`^PT${rSeconds}$`));
    const days = Number(match?.groups?.["days"]) || 0;
    const hours = Number(match?.groups?.["hours"]) || 0;
    const minutes = Number(match?.groups?.["minutes"]) || 0;
    const seconds = Number(match?.groups?.["seconds"]) || 0;
    return ((days * 24 + hours) * 60 + minutes) * 60 + seconds;
}
