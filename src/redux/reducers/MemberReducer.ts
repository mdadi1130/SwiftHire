export const MemberReducer = (state, action) => {
    switch (action.type) {
        case 'refresh': {
            const {members} = action.payload || {};
            return {...state, members, error: ''};
        }
        case 'add-member': {
            const {user} = action.payload || {};
            if (!state.members.map(m => m.userId).includes(user.userId)) {
                return {...state, members: [...state.members, user], error: ''};
            }
        }
        case 'remove-member': {
            const {user} = action.payload || {};
            if (state.members.map(m => m.userId).includes(user.userId)) {
                return {...state, members: state.members.filter(m => m.userId !== user.userId), error: ''};
            }
        }
        case 'error': {
            const {error} = action.payload || {};
            return {...state, error};
        }
    }
    return state;
};
