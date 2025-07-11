import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { StorageProvider } from '../types';

// Mock chrome APIs
const mockChrome = {
  tabs: {
    create: vi.fn(),
  },
  contextMenus: {
    removeAll: vi.fn(),
    create: vi.fn(),
  },
  storage: {
    sync: {
      get: vi.fn(),
    },
  },
  runtime: {
    getURL: vi.fn(),
  },
};

// @ts-ignore
global.chrome = mockChrome;

// Import after setting up mocks
import { onReverseSearch } from './service-worker-functions';

describe('Service Worker Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('onReverseSearch', () => {
    const mockTab = { id: 1, index: 0 };
    const mockSrcUrl = 'https://example.com/image.jpg';

    it('should handle GET requests correctly', async () => {
      const getProvider: StorageProvider = {
        name: 'Test GET',
        icon: 'test.png',
        url: 'https://search.example.com/?url=%s',
        selected: true,
        doNotEncodeUrl: false,
        stripProtocol: false,
        method: 'GET',
        postFieldName: 'url',
        contentType: 'application/x-www-form-urlencoded',
      };

      mockChrome.storage.sync.get.mockResolvedValue({
        openTabAt: 'right',
        openInBackground: false,
        storageProviders: [getProvider],
      });

      mockChrome.tabs.create.mockResolvedValue({ id: 2 });

      await onReverseSearch(
        {
          srcUrl: mockSrcUrl,
          menuItemId: 'Test GET',
          editable: false,
          pageUrl: 'https://example.com',
        },
        mockTab as chrome.tabs.Tab
      );

      expect(mockChrome.tabs.create).toHaveBeenCalledWith({
        url: 'https://search.example.com/?url=https%3A%2F%2Fexample.com%2Fimage.jpg',
        active: true,
        index: 1,
        openerTabId: 1,
      });
    });

    it('should handle POST requests correctly', async () => {
      const postProvider: StorageProvider = {
        name: 'Test POST',
        icon: 'test.png',
        url: 'https://search.example.com/',
        selected: true,
        doNotEncodeUrl: false,
        stripProtocol: false,
        method: 'POST',
        postFieldName: 'imageUrl',
        contentType: 'application/x-www-form-urlencoded',
      };

      mockChrome.storage.sync.get.mockResolvedValue({
        openTabAt: 'right',
        openInBackground: false,
        storageProviders: [postProvider],
      });

      mockChrome.tabs.create.mockResolvedValue({ id: 2 });
      mockChrome.runtime.getURL.mockReturnValue(
        'chrome-extension://test/post-form.html'
      );

      await onReverseSearch(
        {
          srcUrl: mockSrcUrl,
          menuItemId: 'Test POST',
          editable: false,
          pageUrl: 'https://example.com',
        },
        mockTab as chrome.tabs.Tab
      );

      // Verify tab creation with POST form URL
      expect(mockChrome.runtime.getURL).toHaveBeenCalledWith('post-form.html');
      expect(mockChrome.tabs.create).toHaveBeenCalledWith({
        url: expect.stringMatching(
          /chrome-extension:\/\/test\/post-form\.html\?action=https%3A%2F%2Fsearch\.example\.com%2F&fieldName=imageUrl&fieldValue=https%253A%252F%252Fexample\.com%252Fimage\.jpg&contentType=application%2Fx-www-form-urlencoded/
        ),
        active: true,
        index: 1,
        openerTabId: 1,
      });
    });

    it('should handle POST requests with multipart/form-data', async () => {
      const postProvider: StorageProvider = {
        name: 'Test POST Multipart',
        icon: 'test.png',
        url: 'https://upload.example.com/',
        selected: true,
        doNotEncodeUrl: false,
        stripProtocol: false,
        method: 'POST',
        postFieldName: 'file',
        contentType: 'multipart/form-data',
      };

      mockChrome.storage.sync.get.mockResolvedValue({
        openTabAt: 'right',
        openInBackground: false,
        storageProviders: [postProvider],
      });

      mockChrome.tabs.create.mockResolvedValue({ id: 2 });
      mockChrome.runtime.getURL.mockReturnValue(
        'chrome-extension://test/post-form.html'
      );

      await onReverseSearch(
        {
          srcUrl: mockSrcUrl,
          menuItemId: 'Test POST Multipart',
          editable: false,
          pageUrl: 'https://example.com',
        },
        mockTab as chrome.tabs.Tab
      );

      // Verify URL contains multipart content type
      const call = mockChrome.tabs.create.mock.calls[0][0];
      expect(call.url).toContain('contentType=multipart%2Fform-data');
      expect(call.url).toContain('fieldName=file');
    });

    it('should handle POST requests without %s in URL', async () => {
      const postProvider: StorageProvider = {
        name: 'Test POST No Placeholder',
        icon: 'test.png',
        url: 'https://search.example.com/upload',
        selected: true,
        doNotEncodeUrl: false,
        stripProtocol: false,
        method: 'POST',
        postFieldName: 'url',
        contentType: 'application/x-www-form-urlencoded',
      };

      mockChrome.storage.sync.get.mockResolvedValue({
        openTabAt: 'right',
        openInBackground: false,
        storageProviders: [postProvider],
      });

      mockChrome.tabs.create.mockResolvedValue({ id: 2 });
      mockChrome.runtime.getURL.mockReturnValue(
        'chrome-extension://test/post-form.html'
      );

      await onReverseSearch(
        {
          srcUrl: mockSrcUrl,
          menuItemId: 'Test POST No Placeholder',
          editable: false,
          pageUrl: 'https://example.com',
        },
        mockTab as chrome.tabs.Tab
      );

      // Verify URL contains correct action without %s
      const call = mockChrome.tabs.create.mock.calls[0][0];
      expect(call.url).toContain(
        'action=https%3A%2F%2Fsearch.example.com%2Fupload'
      );
      expect(call.url).toContain('fieldName=url');
    });
  });
});
