# Guide de Diagnostic - Problème Supabase sur Netlify

## Problème : Les données ne sont pas enregistrées dans Supabase

### ✅ Étapes de vérification

#### 1. Vérifier les variables d'environnement dans Netlify

1. Allez sur [Netlify Dashboard](https://app.netlify.com)
2. Sélectionnez votre site
3. Allez dans **Site settings** → **Environment variables**
4. Vérifiez que vous avez EXACTEMENT ces deux variables (avec les noms exacts) :
   - `VITE_SUPABASE_URL` (pas `SUPABASE_URL` ni autre variante)
   - `VITE_SUPABASE_ANON_KEY` (pas `SUPABASE_ANON_KEY` ni autre variante)

⚠️ **IMPORTANT** : Les variables doivent commencer par `VITE_` pour être accessibles dans le code client.

#### 2. Vérifier les valeurs des variables

- `VITE_SUPABASE_URL` doit ressembler à : `https://xxxxx.supabase.co`
- `VITE_SUPABASE_ANON_KEY` doit être une longue chaîne de caractères (clé publique)

#### 3. Redéployer après modification des variables

⚠️ **CRUCIAL** : Après avoir modifié ou ajouté des variables d'environnement dans Netlify, vous DEVEZ redéployer :

1. Allez dans **Deploys**
2. Cliquez sur **Trigger deploy** → **Deploy site**
3. Attendez la fin du déploiement

Les variables d'environnement sont injectées au moment du BUILD, pas au runtime. Si vous modifiez les variables sans redéployer, l'ancienne version reste active.

#### 4. Vérifier la console du navigateur

1. Ouvrez votre site Netlify
2. Ouvrez la console du navigateur (F12 → Console)
3. Soumettez le formulaire
4. Regardez les messages :
   - ✅ Si vous voyez `🔍 Supabase Configuration Check:` → Les variables sont chargées
   - ❌ Si vous voyez `❌ Supabase credentials are missing` → Les variables ne sont pas configurées
   - ❌ Si vous voyez une erreur avec code `PGRST116` → Problème de table ou permissions
   - ❌ Si vous voyez une autre erreur → Notez le message exact

#### 5. Vérifier la table Supabase

1. Allez sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Table Editor**
4. Vérifiez que la table `resident_forms` existe avec ces colonnes :
   - `id` (uuid, primary key)
   - `first_name` (text)
   - `last_name` (text)
   - `phone` (text)
   - `email` (text, nullable)
   - `room_number` (text)
   - `problems` (jsonb)
   - `program_choices` (jsonb)
   - `submitted_at` (timestamptz)

#### 6. Vérifier les permissions RLS (Row Level Security)

1. Dans Supabase, allez dans **Authentication** → **Policies**
2. Pour la table `resident_forms`, vérifiez les politiques :
   - Si RLS est activé, vous devez avoir une politique qui permet l'INSERT
   - Ou désactivez temporairement RLS pour tester :
     ```sql
     ALTER TABLE resident_forms DISABLE ROW LEVEL SECURITY;
     ```

### 🔧 Solutions courantes

#### Solution 1 : Variables mal nommées
- ❌ `SUPABASE_URL` → ✅ `VITE_SUPABASE_URL`
- ❌ `SUPABASE_ANON_KEY` → ✅ `VITE_SUPABASE_ANON_KEY`

#### Solution 2 : Pas de redéploiement après modification
- Modifiez les variables → **Redéployez immédiatement**

#### Solution 3 : RLS bloquant les insertions
- Désactivez RLS temporairement ou créez une politique INSERT

#### Solution 4 : Table inexistante ou mal nommée
- Vérifiez que la table s'appelle exactement `resident_forms` (pas `resident_form` ou autre)

### 📝 Test rapide

Pour tester si les variables sont bien chargées, ouvrez la console du navigateur sur votre site Netlify et tapez :

```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
```

Si vous voyez "NOT SET", les variables ne sont pas configurées correctement.

### 🆘 Si le problème persiste

1. Copiez les messages d'erreur exacts de la console du navigateur
2. Vérifiez les logs de déploiement Netlify
3. Vérifiez que le build s'est bien terminé sans erreur

