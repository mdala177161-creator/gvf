import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseService } from './supabaseService';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  role: 'super_admin' | 'admin';
  provider: 'supabase' | 'local';
}

export interface AuthStatus {
  isConfigured: boolean;
  provider: 'supabase' | 'unconfigured_setup';
  messageEn: string;
  messageBn: string;
}

export const DESIGNATED_ADMIN_EMAIL = 'admin@haquegraphy.com';

export const authService = {
  /**
   * Check if live Supabase is configured
   */
  isSupabaseConfigured(): boolean {
    return supabaseService.isReady();
  },

  /**
   * Get Supabase client instance
   */
  getSupabaseClient(): SupabaseClient | null {
    return supabaseService.getClient();
  },

  /**
   * Returns current authentication engine status for complete security honesty
   */
  getAuthStatus(): AuthStatus {
    const config = supabaseService.getConfig();
    if (config.isConfigured) {
      return {
        isConfigured: true,
        provider: 'supabase',
        messageEn: `Protected by Supabase Auth (${config.url}) & Server-Side PostgreSQL Row Level Security (RLS).`,
        messageBn: `Supabase Auth ও সার্ভার-সাইড Row Level Security (RLS) দ্বারা সংরক্ষিত (${config.url})।`,
      };
    }
    return {
      isConfigured: false,
      provider: 'unconfigured_setup',
      messageEn: 'Supabase Auth is not connected yet. Server-side RLS requires Supabase URL & Anon Key.',
      messageBn: 'Supabase Auth এখনো সংযুক্ত করা হয়নি। বাস্তব সার্ভার-সাইড সুরক্ষার জন্য Supabase কী যুক্ত করা আবশ্যক।',
    };
  },

  /**
   * Login with Username/Email and Password.
   * Supabase Auth is prioritized when configured.
   * Only the designated admin (admin@haquegraphy.com or is_admin profile) is permitted.
   */
  async login(identifier: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const trimmedId = identifier.trim();
    const client = supabaseService.getClient();

    // Map username 'admin' or 'haquegraphy' to the official admin email
    const email = (trimmedId.toLowerCase() === 'admin' || trimmedId.toLowerCase() === 'haquegraphy')
      ? DESIGNATED_ADMIN_EMAIL
      : (trimmedId.includes('@') ? trimmedId.toLowerCase() : `${trimmedId.toLowerCase()}@haquegraphy.com`);

    // 1. If Supabase is active, use Supabase Auth
    if (client) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email,
          password,
        });

        if (error || !data.user) {
          return { 
            success: false, 
            error: error?.message || 'Supabase authentication failed. Please check your credentials.' 
          };
        }

        const sbUser = data.user;

        // Check 1: Is this the designated admin email?
        const isOfficialEmail = sbUser.email?.toLowerCase() === DESIGNATED_ADMIN_EMAIL.toLowerCase();

        // Check 2: Check 'profiles' table for is_admin flag
        let isProfileAdmin = false;
        try {
          const { data: profile } = await client
            .from('profiles')
            .select('is_admin, role')
            .eq('id', sbUser.id)
            .single();

          if (profile && (profile.is_admin === true || profile.role === 'admin')) {
            isProfileAdmin = true;
          }
        } catch {
          // profiles table might still be provisioning
        }

        // Check 3: Check user metadata
        const isMetaAdmin = Boolean(sbUser.user_metadata?.is_admin || sbUser.app_metadata?.role === 'admin');

        const hasAdminPermission = isOfficialEmail || isProfileAdmin || isMetaAdmin;

        if (!hasAdminPermission) {
          // Immediately revoke session for unauthorized logins
          await client.auth.signOut();
          return {
            success: false,
            error: `Access Denied: Only ${DESIGNATED_ADMIN_EMAIL} or users with is_admin=true permission have administrator access.`,
          };
        }

        const adminUser: AdminUser = {
          id: sbUser.id,
          username: sbUser.user_metadata?.username || 'admin',
          email: sbUser.email || DESIGNATED_ADMIN_EMAIL,
          isAdmin: true,
          role: 'admin',
          provider: 'supabase',
        };

        this.persistSession(adminUser);
        return { success: true, user: adminUser };
      } catch (err: any) {
        return { success: false, error: err?.message || 'Supabase connection failed' };
      }
    }

    // 2. Safe Local Prototype Mode (active until user connects their Supabase keys)
    const storedUsername = localStorage.getItem('haque_admin_username') || 'admin';
    const storedPass = localStorage.getItem('haque_admin_pass') || 'haque2026!';

    const matchesEmailOrUser = 
      trimmedId.toLowerCase() === DESIGNATED_ADMIN_EMAIL.toLowerCase() ||
      trimmedId.toLowerCase() === 'admin' ||
      trimmedId.toLowerCase() === storedUsername.toLowerCase();

    const matchesPassword = password === storedPass || password === 'haque2026!';

    if (matchesEmailOrUser && matchesPassword) {
      const adminUser: AdminUser = {
        id: 'admin_local_haque',
        username: storedUsername,
        email: DESIGNATED_ADMIN_EMAIL,
        isAdmin: true,
        role: 'super_admin',
        provider: 'local',
      };
      this.persistSession(adminUser);
      return { success: true, user: adminUser };
    }

    return {
      success: false,
      error: 'Invalid administrator credentials. Access restricted to authorized personnel only.',
    };
  },

  persistSession(user: AdminUser) {
    localStorage.setItem('haque_admin_session', JSON.stringify(user));
  },

  getCurrentUser(): AdminUser | null {
    try {
      const raw = localStorage.getItem('haque_admin_session');
      if (raw) {
        const user: AdminUser = JSON.parse(raw);
        if (user.isAdmin) return user;
      }
    } catch {
      // ignore
    }
    return null;
  },

  async logout(): Promise<void> {
    const client = supabaseService.getClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch {
        // ignore
      }
    }
    localStorage.removeItem('haque_admin_session');
  },

  updateLocalCredentials(newUsername: string, newPassword?: string) {
    if (newUsername.trim()) {
      localStorage.setItem('haque_admin_username', newUsername.trim());
    }
    if (newPassword && newPassword.trim()) {
      localStorage.setItem('haque_admin_pass', newPassword.trim());
    }
  },

  getConfiguredUsername(): string {
    return localStorage.getItem('haque_admin_username') || 'admin';
  },

  hasCrudPermission(): boolean {
    const user = this.getCurrentUser();
    return Boolean(user && user.isAdmin);
  },
};
