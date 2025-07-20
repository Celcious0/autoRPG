export default class ApiClient {
  #base = 'https://autorpg-qheg.onrender.com/api';
  #token;
  #uid;

  constructor(token, uid) {
    this.#token = token;
    this.#uid   = uid;
  }

  async #request(path, options = {}) {
    const res = await fetch(`${this.#base}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.#token}`
      },
      ...options
    });
    if (!res.ok) throw new Error(`API Error ${res.status}`);
    return res.json();
  }

  fetchUserData() {
    return this.#request(`/userdata?uid=${encodeURIComponent(this.#uid)}`, { method: 'GET' });
  }
  fetchInventory() {
    return this.#request(`/inventory?uid=${encodeURIComponent(this.#uid)}`, { method: 'GET' });
  }
  equip(itemId) {
    return this.#request('/equip', {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId })
    });
  }
  unequip(itemId) {
    return this.#request('/unequip', {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId })
    });
  }
}