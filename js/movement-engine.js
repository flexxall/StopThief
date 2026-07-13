window.StopThief = window.StopThief || {};

StopThief.movement = {
    getCurrentNeighbors(thiefPosition) {
        const node = StopThief.board[thiefPosition];
        return node ? node.neighbors : [];
    },

    isPortal(type) {
        return type === 'Dr' || type === 'Gl';
    },

    isSubway(id) {
        return StopThief.constants.SUBWAY_IDS.includes(id);
    },

    markCrimeAsVisited(position) {
        const node = StopThief.board[position];
        if (!node || node.type !== 'Cr') return;
        node.type = position >= 500 ? 'St' : 'Fl';
    },

    resetCrimeScenesInBuilding(buildingNumber) {
        const crimes = StopThief.constants.BUILDING_CRIMES[buildingNumber];
        if (!crimes) return;
        for (const crimeId of crimes) {
            if (StopThief.board[crimeId]) StopThief.board[crimeId].type = 'Cr';
        }
    },

    getLocationsOnOtherSideOfDoorWindow(adjacents) {
        const state = StopThief.state;
        let temp = [...adjacents];
        const current = state.thiefPosition;

        if (state.lastPosition > 499) {
            temp = temp.filter(id => id < 500);
        } else {
            temp = temp.filter(id => id > 499);
            if (temp.length > 0) {
                this.resetCrimeScenesInBuilding(Math.floor(current / 100));
            }
        }

        if (temp.length === 0) {
            temp = [...adjacents];
            if (state.lastPosition > current) {
                temp = temp.filter(id => id < current);
            } else {
                temp = temp.filter(id => id > current);
            }
        }
        return temp;
    },

    dealWithSubwayTravel(adjacents) {
        const state = StopThief.state;
        const { SUBWAY_IDS, CORNER_SUBWAY_IDS } = StopThief.constants;

        if (this.isSubway(state.lastPosition)) {
            return adjacents.filter(id => !this.isSubway(id));
        }
        if (CORNER_SUBWAY_IDS.includes(state.thiefPosition)) {
            const subwayChoices = SUBWAY_IDS.filter(
                id => id !== state.thiefPosition && id !== state.lastPosition
            );
            return subwayChoices.length > 0
                ? subwayChoices
                : SUBWAY_IDS.filter(id => id !== state.thiefPosition);
        }
        return adjacents;
    },

    lookForAdjacentCrimeLocations(adjacents) {
        return adjacents.filter(id => StopThief.board[id]?.type === 'Cr');
    },

    getNextLocation() {
        const state = StopThief.state;
        let adjacents = this.getCurrentNeighbors(state.thiefPosition).filter(n => n !== state.lastPosition);
        if (adjacents.length === 0) return state.thiefPosition;

        const currentType = StopThief.board[state.thiefPosition]?.type;
        if (this.isPortal(currentType)) {
            adjacents = this.getLocationsOnOtherSideOfDoorWindow(adjacents);
        }

        if (this.isSubway(state.thiefPosition)) {
            adjacents = this.dealWithSubwayTravel(adjacents);
        }

        const crimeLocations = this.lookForAdjacentCrimeLocations(adjacents);
        if (crimeLocations.length > 0) {
            adjacents = crimeLocations;
        }

        if (adjacents.length === 0) return state.thiefPosition;
        return adjacents[Math.floor(Math.random() * adjacents.length)];
    },

    executeThiefMove() {
        const state = StopThief.state;
        this.markCrimeAsVisited(state.thiefPosition);
        const next = this.getNextLocation();
        state.lastPosition = state.thiefPosition;
        state.thiefPosition = next;
        return {
            id: state.thiefPosition,
            type: StopThief.board[state.thiefPosition]?.type || 'Fl'
        };
    },

    getDisplayType(pos, destinationType) {
        return (pos >= 500 && !this.isPortal(destinationType)) ? 'St' : destinationType;
    },

    formatDisplayString(pos, destinationType) {
        const prefix = Math.floor(pos / 100);
        const type = this.getDisplayType(pos, destinationType);
        return `${prefix} ${type}`;
    }
};
