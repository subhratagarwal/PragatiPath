// Helper to convert DMS rational array to decimal degrees
const convertDMSToDD = (dms: [number, number][], ref: string): number => {
    const degrees = dms[0][0] / dms[0][1];
    const minutes = dms[1][0] / dms[1][1];
    const seconds = dms[2][0] / dms[2][1];
    let dd = degrees + minutes / 60 + seconds / 3600;
    if (ref === "S" || ref === "W") {
        dd = dd * -1;
    }
    return dd;
};

// Main EXIF parsing logic
const getGpsDataFromFile = (file: File): Promise<{ latitude: number; longitude: number } | null> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (!e.target || !e.target.result) return resolve(null);

            const view = new DataView(e.target.result as ArrayBuffer);
            if (view.getUint16(0, false) !== 0xFFD8) {
                return resolve(null); // Not a valid JPEG
            }

            let length = view.byteLength, offset = 2;
            while (offset < length) {
                // Find APP1 Marker
                if (view.getUint16(offset, false) === 0xFFE1) {
                    // Check for "Exif" header
                    if (view.getUint32(offset + 4, false) === 0x45786966) {
                        const tiffOffset = offset + 10;
                        let littleEndian: boolean;
                        // Check TIFF Header for endianness
                        if (view.getUint16(tiffOffset, false) === 0x4949) {
                            littleEndian = true;
                        } else if (view.getUint16(tiffOffset, false) === 0x4D4D) {
                            littleEndian = false;
                        } else {
                            return resolve(null);
                        }

                        if (view.getUint16(tiffOffset + 2, littleEndian) !== 0x002A) {
                             return resolve(null); // Not a valid TIFF structure
                        }

                        const firstIFDOffset = view.getUint32(tiffOffset + 4, littleEndian);
                        if (firstIFDOffset < 8) return resolve(null);

                        const gpsData = findGpsTags(view, tiffOffset, tiffOffset + firstIFDOffset, littleEndian);
                        
                        if (gpsData.lat && gpsData.lon && gpsData.latRef && gpsData.lonRef) {
                            return resolve({
                                latitude: convertDMSToDD(gpsData.lat, gpsData.latRef),
                                longitude: convertDMSToDD(gpsData.lon, gpsData.lonRef),
                            });
                        }
                    }
                }
                offset += 2;
                offset += view.getUint16(offset, false);
            }
            return resolve(null); // No EXIF or GPS data found
        };
        reader.onerror = () => resolve(null);
        reader.readAsArrayBuffer(file);
    });
};

const findGpsTags = (view: DataView, tiffStart: number, dirStart: number, littleEndian: boolean): any => {
    const gps: { [key: string]: any } = {};
    let gpsIFDOffset = 0;

    // First, find the GPS IFD pointer in the main IFD
    const entries = view.getUint16(dirStart, littleEndian);
    for (let i = 0; i < entries; i++) {
        const entryOffset = dirStart + i * 12 + 2;
        const tag = view.getUint16(entryOffset, littleEndian);
        if (tag === 0x8825) { // GPS IFD Pointer tag
            gpsIFDOffset = tiffStart + view.getUint32(entryOffset + 8, littleEndian);
            break;
        }
    }
    
    if (gpsIFDOffset === 0) return gps; // No GPS data

    // Now, parse the GPS IFD
    const gpsEntries = view.getUint16(gpsIFDOffset, littleEndian);
    for (let i = 0; i < gpsEntries; i++) {
        const entryOffset = gpsIFDOffset + i * 12 + 2;
        const tag = view.getUint16(entryOffset, littleEndian);
        const components = view.getUint32(entryOffset + 4, littleEndian);
        const valueOffset = view.getUint32(entryOffset + 8, littleEndian) + tiffStart;

        switch (tag) {
            case 0x0001: // GPSLatitudeRef
                gps.latRef = String.fromCharCode(view.getUint8(entryOffset + 8));
                break;
            case 0x0002: // GPSLatitude
                gps.lat = readRationalArray(view, valueOffset, littleEndian, components);
                break;
            case 0x0003: // GPSLongitudeRef
                gps.lonRef = String.fromCharCode(view.getUint8(entryOffset + 8));
                break;
            case 0x0004: // GPSLongitude
                gps.lon = readRationalArray(view, valueOffset, littleEndian, components);
                break;
        }
    }
    return gps;
};

const readRationalArray = (view: DataView, offset: number, littleEndian: boolean, components: number): [number, number][] => {
    const arr: [number, number][] = [];
    for(let i=0; i<components; i++) {
        arr.push([
            view.getUint32(offset + i * 8, littleEndian),
            view.getUint32(offset + 4 + i * 8, littleEndian)
        ]);
    }
    return arr;
};

export { getGpsDataFromFile as getGpsCoordinates };
