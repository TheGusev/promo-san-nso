-- Add RLS policies for user_roles table
CREATE POLICY "Users can read their own roles" ON user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Only admins can insert roles" ON user_roles 
  FOR INSERT 
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles" ON user_roles 
  FOR UPDATE 
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles" ON user_roles 
  FOR DELETE 
  USING (has_role(auth.uid(), 'admin'));