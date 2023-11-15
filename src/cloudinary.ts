type Dimensions = {
    width: number
    height: number
}

// https://res.cloudinary.com/bradgarropy/image/upload/f_auto,q_auto/bradgarropy.com/pages/home/profile.jpg

const getImageDimensions = async (imageUrl: string): Promise<Dimensions> => {
    const url = new URL(imageUrl)

    let pathSegments = url.pathname.split("/upload")
    pathSegments = [pathSegments[0], "/upload", "/fl_getinfo", pathSegments[1]]
    const reqURL = "https://res.cloudinary.com" + pathSegments.join("")

    const response = await fetch(reqURL)
    const json = await response.json()

    const dimensions: Dimensions = {
        width: json.output.width,
        height: json.output.height,
    }

    return dimensions
}

const getBlurImage = (imageUrl: string): string => {
    const url = new URL(imageUrl)

    let pathSegments = url.pathname.split("/upload")
    pathSegments = [
        pathSegments[0],
        "/upload",
        "/w_100/e_blur:1000,q_auto,f_webp",
        pathSegments[1],
    ]
    return "https://res.cloudinary.com" + pathSegments.join("")
}

const isCloudinaryImage = (url: string) => {
    if (url.startsWith("http://res.cloudinary.com")) {
        return true
    }

    if (url.startsWith("https://res.cloudinary.com")) {
        return true
    }

    return false
}

export {getBlurImage, getImageDimensions, isCloudinaryImage}
export type {Dimensions}
