//  Not sure if ical will end up bundled on the FE, but I really don't want to write my own func for this
//  ToDo: Investigate impact on bundle size if any and find a tiny lib?
import ical from 'ical-generator';
export const previewMode =
	(import.meta.env ? import.meta.env : process.env).VITE_DATOCMS_SHOWDRAFTS == 'true';

// ToDo get this from contentful?
export const navigation = [
	{ title: 'Gigs', href: '/' },
	{ title: 'Venues', href: '/venues' },
	{ title: 'Merch', href: 'https://store.sydneymusic.net' }
];

export const navigationFooterMusic = [
	{ title: 'Home', href: '/' },
	{ title: 'Sydney Gig Guide', href: 'https://sydneymusic.net/gig-guide' },
	{ title: 'Venue Directory', href: 'https://sydneymusic.net/gig-guide/venues' },
	{ title: 'Weekly Gig Guide Playlist', href: 'https://sydneymusic.net/playlist' }
];

export const navigationFooterSupport = [
	{ title: 'Make a Donation', href: 'https://sydneymusic.net/support' },
	{ title: 'Commercial Sponsorship', href: 'https://sydneymusic.net/support/commercial' },
	{ title: 'Wall of Legends', href: 'https://sydneymusic.net/support/wall-of-legends' },
	{ title: 'Merch Store', href: 'https://store.sydneymusic.net' },
	{ title: 'Join the Discord!', href: 'https://discord.gg/jv8VKrXymJ' }
];

export const navigationFooterAbout = [
	{ title: 'About', href: 'https://sydneymusic.net/about' },
	{ title: 'AI Policy', href: 'https://sydneymusic.net/about/ai-policy' },
	{ title: 'Contact', href: 'https://sydneymusic.net/contact' },
	{ title: 'License our API', href: 'https://sydneymusic.net/api-license' }
];

export const formatDay = (dateOrString) => {
	const d = new Date(dateOrString);
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	return days[d.getDay()];
};

export const formatMonth = (dateOrString) => {
	const d = new Date(dateOrString);
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	return months[d.getMonth()];
};

export const formatDate = (dateOrString) => {
	const d = new Date(dateOrString);
	return `${formatMonth(d)} ${d.getFullYear()}`;
};

export const formatDateLong = (dateOrString) => {
	const d = new Date(dateOrString);
	return `${String(d.getDate()).padStart(2, '0')} ${String(formatMonth(d))}`;
};

export const groupBy = (items, cb) => {
	const group = items
		.map((i) => ({ ...i, key: cb(i) }))
		.reduce((acc, i) => {
			const { key, ...item } = i; // Don't leak the key
			const prevItems = acc[key] ? acc[key] : [];
			return { ...acc, [key]: [...prevItems, item] };
		}, {});

	return Object.entries(group).map(([key, value]) => ({ label: key, items: value }));
};

export const createCalendarLink = (event, venue) => {
	const v = venue ? venue : event.venue;
	const start = new Date(event.date);
	const end = new Date(start);
	end.setTime(start.getTime() + 60 * 60 * 1000 * 2.5); // Default to 2.5 hours

	const cal = ical();
	cal.createEvent({
		start,
		end,
		summary:
			event.promotedName +
			(event.performersListJson ? ' w/ ' + event.performersListJson.join(', ') : ''),
		url: event.ticketUrl,
		location: v.venueName + (v.address ? ', ' + v.address : '') + (v.suburb ? ', ' + v.suburb : '')
	});
	return `data:text/calendar;charset=utf8,${encodeURIComponent(cal.toString())}`;
};

export const isToday = (date) => {
	const today = new Date();
	return today.toDateString() === date.toDateString();
};

export const isTomorrow = (date) => {
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	return tomorrow.toDateString() === date.toDateString();
};

export const formatDayOfWeek = (date) =>
	isToday(date) ? 'Today' : isTomorrow(date) ? 'Tomorrow' : formatDay(date);
