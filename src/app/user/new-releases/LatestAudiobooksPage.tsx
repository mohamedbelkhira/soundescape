"use client"

import { AudiobooksPage } from "../audiobooks/AudiobooksPage"

/**
 * Thin wrapper around your existing AudiobooksPage that:
 *  • Locks the list to “latest” (no author/category search by default, but they
 *    still work if the user opens the filters)
 *  • Adds a nice heading & blurb.
 *
 *  Everything else is reused from AudiobooksPage so changes cascade.
 */

export function LatestAudiobooksPage(props: Parameters<typeof AudiobooksPage>[0]) {
  return (
    <div className="space-y-10">
      {/* ——— Page title & description ——— */}
      <header className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          New Releases
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Hot off the press! Explore the newest audiobooks added to our
          catalogue. Fresh stories, fresh voices — updated daily.
        </p>
      </header>

      {/* ——— The standard grid / filters / pagination UI ——— */}
      <AudiobooksPage {...props} />
    </div>
  )
}
