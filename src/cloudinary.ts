import fetch from "node-fetch"
type Dimensions = {
    width: number
    height: number
}

// https://res.cloudinary.com/bradgarropy/image/upload/f_auto,q_auto/bradgarropy.com/pages/home/profile.jpg

const getImageDimensions = async (imageUrl: string): Promise<Dimensions> => {
    const url = new URL(imageUrl)

    let pathSegments = url.pathname.split("/upload")
    console.log(pathSegments)
    pathSegments = [pathSegments[0], "/upload", "/fl_getinfo", pathSegments[1]]
    const reqURL = "https://res.cloudinary.com" + pathSegments.join("")

    const response = await fetch(reqURL)
    const json = (await response.json()) as any

    const dimensions: Dimensions = {
        width: json.output.width,
        height: json.output.height,
    }

    return dimensions
}

const getBlurImage = async (imageUrl: string): Promise<string> => {
    const url = new URL(imageUrl)

    let pathSegments = url.pathname.split("/upload")
    pathSegments = [
        pathSegments[0],
        "/upload",
        "/w_100/e_blur:1000,q_auto,f_webp",
        pathSegments[1],
    ]

    const reqURL = "https://res.cloudinary.com" + pathSegments.join("")

    const response = await fetch(reqURL)
    const buffer = await response.arrayBuffer()
    const data = Buffer.from(buffer).toString("base64")

    return `data:image/webp;base64,${data}`

    // return "https://res.cloudinary.com" + pathSegments.join("")
}

const isCloudinaryImage = (url: string) => {
    if (url.startsWith("https://res.cloudinary.com")) {
        if (url.split("/upload").length === 2) return true
    }

    return false
}

export {getBlurImage, getImageDimensions, isCloudinaryImage}
export type {Dimensions}
