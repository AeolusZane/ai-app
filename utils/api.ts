
const createURL = path => {
    return window.location.origin + path;
}

export const updateEntry = async (id, content) => {
    const res = await fetch(new Request(createURL(`/api/journal/${id}`), {
        method: 'PATCH',
        body: JSON.stringify({ content }),
    }));

    if (res.ok) {
        const data = await res.json();
        return data.data
    }
}

export const createNewEntry = async () => {
    const res = await fetch(new Request(createURL('/api/journal'), {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json',
        // },
        // body: JSON.stringify({ entry }),
    }))

    if (res.ok) {
        const data = await res.json();
        return data.data;
    }
}

export const getEntries = async () => {
    const res = await fetch(new Request(createURL('/api/journal'), {
        method: 'GET',
    }))

    if (res.ok) {
        const data = await res.json();
        return data.data;
    }
}

export const askQuestion = async (question) => {
    const res = await fetch(new Request(createURL('/api/question'), {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json',
        // },
        body: JSON.stringify({ question }),
    }))

    if (res.ok) {
        const data = await res.json();
        return data.data;
    }
}