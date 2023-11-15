import {expect, test} from "vitest"

import {
    getBlurImage,
    getImageDimensions,
    isCloudinaryImage,
} from "../src/cloudinary"

test("identifies http cloudinary images", () => {
    const result = isCloudinaryImage("http://res.cloudinary.com/photo.jpg")
    expect(result).toEqual(true)
})

test("identifies https cloudinary images", () => {
    const result = isCloudinaryImage("https://res.cloudinary.com/photo.jpg")
    expect(result).toEqual(true)
})

test("identifies other images", () => {
    const result = isCloudinaryImage("https://example.com/photo.jpg")
    expect(result).toEqual(false)
})

test("gets image dimensions", async () => {
    const dimensions = await getImageDimensions(
        "https://res.cloudinary.com/winterlood/image/upload/v1700021380/blog/oor6bftmbqvqc93argrs.png",
    )

    expect(dimensions).toEqual({width: 902, height: 460})
})

test("gets blur image", async () => {
    const blurImageURL = getBlurImage(
        "https://res.cloudinary.com/winterlood/image/upload/v1700021380/blog/oor6bftmbqvqc93argrs.png",
    )

    expect(blurImageURL).toEqual(
        "https://res.cloudinary.com/winterlood/image/upload/w_100/e_blur:1000,q_auto,f_webp/v1700021380/blog/oor6bftmbqvqc93argrs.png",
    )
})
