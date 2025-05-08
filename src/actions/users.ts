"use server";

import { IUser } from "@models/User";
import User from "@models/User";
import dbConnect from "@lib/mongodb";

export async function findUserById(id: string): Promise<IUser | null> {
  try {
    await dbConnect();
    const user = await User.findById(id).select("-password");
    return user ? JSON.parse(JSON.stringify(user)) : null;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    return null;
  }
}

export async function getAllUsers(): Promise<IUser[]> {
  try {
    await dbConnect();
    const users = await User.find().select("-password");
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error("Error getting all users:", error);
    return [];
  }
}

export async function getUsersByRole(role: string): Promise<IUser[]> {
  try {
    await dbConnect();
    const users = await User.find({ role }).select("-password");
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error(`Error getting users by role ${role}:`, error);
    return [];
  }
}

export async function addUser(userData: Omit<IUser, "_id" | "createdAt" | "updatedAt">): Promise<IUser | null> {
  try {
    await dbConnect();
    const newUser = await User.create(userData);
    const userWithoutPassword = { ...JSON.parse(JSON.stringify(newUser)), password: undefined };
    return userWithoutPassword;
  } catch (error) {
    console.error("Error adding user:", error);
    return null;
  }
}

export async function updateUser(userData: Partial<IUser> & { _id: string }): Promise<IUser | null> {
  try {
    await dbConnect();
    const { _id, ...updateData } = userData;
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    ).select("-password");
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    await dbConnect();
    await User.findByIdAndDelete(id);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
}
