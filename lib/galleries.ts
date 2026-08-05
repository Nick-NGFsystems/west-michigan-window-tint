/**
 * Per-service gallery groups.
 *
 * Lives in its OWN module, not in ServiceCardGrid.tsx: that file is
 * 'use client', and a server component importing a plain value from a client
 * module receives a client *reference* rather than the value itself — so
 * `GALLERY_KEYS.map(...)` throws "map is not a function" at prerender. Shared
 * constants used on both sides of the boundary belong in a neutral module.
 *
 * WHY SEPARATE TOP-LEVEL GROUPS: a data-ngf-group path must be exactly two
 * segments and item sub-fields are flat scalars, so `services.items.0.gallery.0`
 * cannot be expressed. Per-item image LISTS are therefore impossible inside the
 * services group. Because the services here are a fixed set, one sibling group
 * per service is the correct shape and gives real add/remove/reorder.
 *
 * Order must match the services array in app/page.tsx. Adding a service means
 * adding a key here.
 */
export const GALLERY_KEYS = ['tintGallery', 'residentialGallery', 'vinylGallery', 'lightingGallery'] as const

export const GALLERY_ITEM_FIELDS =
  '[{"key":"src","label":"Photo","type":"image"},{"key":"alt","label":"Alt text","type":"text"}]'
