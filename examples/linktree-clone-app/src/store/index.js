import create from 'zustand';
import altogic from '../lib/altogic';

export const useLinkStore = create(set => ({
	links: [],
	editModalIsOpen: false,
	addModalIsOpen: false,
	selectedLink: null,
	setSelectedLink: link => set({ selectedLink: link }),
	setEditModalIsOpen: status => set({ editModalIsOpen: status }),
	setAddModalIsOpen: status => set({ addModalIsOpen: status }),
	setLinks: links => set({ links }),
	addLink: link => set(state => ({ links: [link, ...state.links] })),
	removeLink: id => set(state => ({ links: state.links.filter(link => link._id !== id) })),
	updateLink: updatedLink => {
		set(state => ({
			links: state.links.map(link => {
				if (link._id === updatedLink._id) link = updatedLink;
				return link;
			}),
		}));
	},
}));

export const useAuthStore = create(set => ({
	user: altogic.auth.getUser(),
	session: altogic.auth.getSession(),
	setUser: user => {
		set({ user });
		altogic.auth.setUser(user);
	},
	setSession: session => {
		set({ session });
		altogic.auth.setSession(session);
	},
	updateUserProperty: (property, value) => {
		set(state => {
			const user = { ...state.user, [property]: value };
			altogic.auth.setUser(user);
			return { user };
		});
	},
	reset: () => set({ user: null, session: null }),
}));
