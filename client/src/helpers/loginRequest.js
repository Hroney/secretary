const loginRequest = async (username, password) => {
    const response = await fetch('http://localhost:5555/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.status === 200) {
        const data = await response.json();
        return { success: true, userId: data.userId };
    } else {
        return { success: false };
    }
};

export default loginRequest