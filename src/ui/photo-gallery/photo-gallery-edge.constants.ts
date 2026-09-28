/** Доля ширины stage для edge-tap на touch (~половина desktop slide-zone). */
export const PHOTO_GALLERY_EDGE_ZONE_WIDTH_RATIO = 0.19

/** max-width edge-tap на touch в rem (desktop slide-zone в CSS — 13rem). */
export const PHOTO_GALLERY_EDGE_ZONE_MAX_REM = 6.5

export const PHOTO_GALLERY_EDGE_TAP_MAX_MOVE_PX = 12

export const PHOTO_GALLERY_EDGE_TAP_MAX_MS = 350

export const getPhotoGalleryEdgeZoneWidthPx = (stageWidth: number): number =>
	Math.min(
		stageWidth * PHOTO_GALLERY_EDGE_ZONE_WIDTH_RATIO,
		PHOTO_GALLERY_EDGE_ZONE_MAX_REM * 16,
	)
