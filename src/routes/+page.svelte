<script>
	import Event from '$lib/components/event.svelte';
	import Feedprompt from '$lib/components/feedprompt.svelte';
	import SeoSocial from '$lib/components/seo-social.svelte';
	import Playlist from '$lib/components/playlist.svelte';
	import { createCalendarLink } from '$lib/globals.mjs';
	import Button from '$lib/components/button.svelte';
	import Heading from '$lib/components/heading.svelte';
	import { mds } from '$lib/donorstats.js';
	import DonationForm from '$lib/components/donation-form.svelte';
	let { data } = $props();

	let gigCounter = $state(0);
	let whichPrompt = $state(0);
	const increment = () => {
		gigCounter++;
		return '';
	};
	const resetCounter = () => {
		if (gigCounter > 9) gigCounter = 0;
		return '';
	};
	const incrementDisplay = () => {
		whichPrompt++;
		return '';
	};
	let gigCount = $derived(
		data.gigs.reduce(
			(acc, month) => acc + month.items.reduce((dayAcc, day) => dayAcc + day.items.length, 0),
			0
		)
	);
</script>

<SeoSocial title="Gig Guide" />

<!--<div class="flex flex-col justify-end items-start">
				<Paragraph variant="sm" class="italic mb-0">Proudly serving Sydney since 2022</Paragraph>
				<Paragraph variant="xs">
					Last updated: <span class="">{data.lastUpdated}</span><br />
					<a href="/gig-guide/latest/" class="font-bold text-ruby underline">View latest updates</a> &raquo;<br />
					<a href="mailto:gigs@sydneymusic.net" class="text-ruby underline">Send us gig tips</a>
				</Paragraph>
			
		</div>-->

<div class="max-w-xl flex flex-col md:flex-row px-5 mx-auto overflow-x-clip pt-5 md:pt-10">
	<div class="contents md:flex md:flex-col space-y-5">
		<!-- header -->
		<div class="place-self-center md:place-self-auto">
			<div class="flex justify-center flex-col">
				<Heading level={1} variant="md" class="mt-5 md:mt-0 mb-10 stretch uppercase font-normal text-center sm:max-w-lg" style="line-height : 1">
					Your trusty guide for<br /><span class="text-ruby">unofficial showcases</span>
				</Heading>
			</div>
			<div class="font-semibold text-center">There are {new Intl.NumberFormat("en-AU").format(data.gigs.totalCount)} gigs to be explored below.</div>

			<div class="space-y-5 mt-5">
				<div class="text-sm text-center"><strong>Does your community or region need a gig guide?</strong><br />We can help! <a href="mailto:contact@sydneymusic.net" class="underline">E-mail us</a> for more information</div>
				<div class="flex place-content-center gap-3">
					<Button label="Submit a gig" variant="primary" href="mailto:joe@sydneymusic.net?subject=Submitting a gig for smallnoise" />
					<Button label="Support us" variant="secondary" href="https://sydneymusic.net/support" />
				</div>
				<div class="text-sm text-center">
					<div><a href="https://sydneymusic.net/jobs" class="underline"><strong>We are hiring!</strong></a></div>
					<div class="text-xs">Made possible with the assistance of Sound NSW.</div>
				</div>
				<div class="text-xs text-center italic">Gig research contributed by Callum from <a href="https://au.skramz.directory/" class="underline" target="_blank">aus skramz directory</a><br />This site was created from <a href="https://github.com/sydneymusic-joe/sydneymusic" class="underline">SydneyMusic’s open source codebase</a></div>
			</div>
			
		</div>
		<!-- gig guide -->
		<div class="gigcolumn">
			<h4 class="mb-2 uppercase text-sm font-semibold text-ruby">Filter:</h4>
			<div class="filterbox w-full mb-5">
				<label for="toggle-freegigs" class="flex items-center cursor-pointer relative">
					<input type="checkbox" id="toggle-freegigs" class="sr-only" />
					Free / pay-what-you-can
				</label>
				<label for="toggle-selected" class="flex items-center cursor-pointer relative">
					<input type="checkbox" id="toggle-selected" class="sr-only" />
					My favourites
				</label>
			</div>

			{#each data.gigs as month}
				<div class="guide-month mb-10">
					{#each month.items as { label, items }}
						<Heading level={3} variant="md" class="stretch font-normal mb-8 mt-8 uppercase border-b border-black">
							<span class="text-ruby">{label.split(':')[1]}</span>
							{label.split(':')[0]}
							{month.label}
						</Heading>
						<div class="day">
							{#each items as event}
								<div
									class="eventcardhost flex flex-row-reverse gap-2 {event.isFree || event.isPwyc
										? 'freegig'
										: ''} {event.isPwyc ? 'pwycgig' : ''}"
								>
									<div
										data-gigid={event.id}
										data-gigStartDate={event.date}
										class="sharegig mt-[3px] w-5 flex-none cursor-pointer"
									>
										<img
											class="w-6"
											alt="Add to your selections"
											src="/shareability-unselected.svg"
										/>
									</div>
									<Event
										name={event.promotedName}
										gigId={event.id}
										performers={event.performersListJson}
										calendarLink={createCalendarLink(event)}
										venue={event.venue}
										website={event.ticketUrl}
										comment={event.furtherInfo}
										initials={event.furtherInfoContributorInitials}
										time={event.time}
										isFree={event.isFree}
										isPwyc={event.isPwyc}
									/>
								</div>
								{increment()}
							{/each}
						</div>
						{#if gigCounter > 9}
							<Feedprompt Index={whichPrompt} />
							{resetCounter()}
							{incrementDisplay()}
						{/if}
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>

<div id="shareprompt" class="hidden">
	<button class="share plausible-event-name=Share+Prompt+Click"
		>Share my selections<span></span></button
	>
	<button class="clear plausible-event-name=Share+Clear+All">Clear all</button>
</div>

<div id="sharesheet" class="space-y-3">
	<div class="title text-lg font-bold">You've selected <span></span> to share!</div>
	<div class="hint text-sm italic">Here's a preview of your list:</div>

	<div
		id="share-preview"
		class="bg-white text-xs max-h-[200px] max-w-[360px] m-y-5 text-black p-2 break-all"
		style="border : 1px dashed"
	>
		Preview text here
	</div>

	<div class="text-xs">
		<div class="flex gap-x-1 items-center">
			<input type="checkbox" id="share-links" checked />
			<label for="share-links">Include links</label>
		</div>
	</div>

	<div class="flex buttonpanel">
		<button id="shareability-copy" class="plausible-event-name=Share+Sheet+Copy">Copy</button>
		<button id="shareability-share" class="plausible-event-name=Share+Sheet+Share">Share</button>
		<button id="shareability-close" class="plausible-event-name=Share+Sheet+Close">Close</button>
	</div>
</div>
