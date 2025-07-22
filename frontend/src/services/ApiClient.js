export default class ApiClient {
  #base = 'https://autorpg-gnwi.onrender.com/api';
  #token;
  #uid;

  constructor(token, uid) {
    this.#token = token;
    this.#uid   = uid;
  }

  async #request(path, options = {}) {
    const headers = {
      'Authorization': `Bearer ${this.#token}`
    };
    if (options.body) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${this.#base}${path}`, {
      headers,
      ...options
    });
    if (!res.ok) throw new Error(`API Error ${res.status}`);
    return res.json();
  }

  fetchUserData() {
    return this.#request(
      `/userdata?uid=${encodeURIComponent(this.#uid)}`, 
      { method: 'GET' }
    );
  }
  fetchInventory() {
    return this.#request(
      `/inventory?uid=${encodeURIComponent(this.#uid)}`, 
      { method: 'GET' }
    );
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