// describe('some test', () => {
//     it('return true', () => {
//         expect(true).toEqual(true);
//     });
// });

class FriendsList {
    friends = [];

    addFriend(name) {
        this.friends.push(name);
        this.announceFriendship(name);
    }

    announceFriendship(name) {
        global.console.log(`${name} is now a friend`);
    }

    removeFriend(name) {
        const idx = this.friends.indexOf(name);
        if (idx === -1) {
            throw new Error('Friend is not in friend list');
        }
        this.friends.splice(idx, 1);
    }
}
describe.skip('FriendsList', () => {
    let friendsList;

    beforeEach(() => {
        friendsList = new FriendsList();
    });

    it('initializes friends list', () => {
        expect(friendsList.friends.length).toEqual(0);
    });

    it('add friends to list', () => {
        friendsList.addFriend('John');
        expect(friendsList.friends.length).toEqual(1);
    });

    it('announce friendship', () => {
        friendsList.announceFriendship = jest.fn();
        expect(friendsList.announceFriendship).not.toHaveBeenCalled();
        friendsList.addFriend('John');
        expect(friendsList.announceFriendship).toHaveBeenCalledWith('John');
    });

    describe('removeFriend', () => {
        it('remove friend from the list', () => {
            friendsList.addFriend('Jonny');
            expect(friendsList.friends[0]).toEqual('Jonny');
            friendsList.removeFriend('Jonny');
            expect(friendsList.friends[0]).toBeUndefined();
        });

        it('throw the error if friend does not exists', () => {
            expect(() => friendsList.removeFriend('Jonny')).toThrow(new Error('Friend is not in friend list'));

        });
    })
});
