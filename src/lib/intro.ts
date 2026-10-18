export const INTRO_SEEN_KEY = "fc-intro-seen";

/**
 * Runs before first paint (inlined in <head>) so returning visitors and people who
 * prefer reduced motion never see the intro flash. `?intro` in the URL forces a replay.
 */
export const introBootScript = `try{var d=document.documentElement,q=location.search.indexOf('intro')>-1;if(!q&&(sessionStorage.getItem('${INTRO_SEEN_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches))d.classList.add('intro-skip')}catch(e){}`;
